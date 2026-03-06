import { getStore } from "@netlify/blobs";
import { randomBytes, pbkdf2Sync } from "node:crypto";

const USERS_STORE = "myogen-users";
const SESSIONS_STORE = "myogen-sessions";

export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    salt: string;
    tier: "free" | "premium";
    premiumExpiresAt: string | null;
    messagesUsed: number;
    messagesResetAt: string;
    quizzesUsedToday: number;
    quizzesResetAt: string;
    createdAt: string;
}

export interface SafeUser {
    id: string;
    email: string;
    name: string;
    tier: "free" | "premium";
    premiumExpiresAt: string | null;
    messagesUsed: number;
    messagesResetAt: string;
    quizzesUsedToday: number;
    quizzesResetAt: string;
    createdAt: string;
}

export interface Session {
    userId: string;
    email: string;
    createdAt: string;
    expiresAt: string;
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const s = salt || randomBytes(32).toString("hex");
    const hash = pbkdf2Sync(password, s, 100000, 64, "sha512").toString("hex");
    return { hash, salt: s };
}

function generateToken(): string {
    return randomBytes(48).toString("hex");
}

function toSafeUser(user: User): SafeUser {
    const { passwordHash, salt, ...safe } = user;
    return safe;
}

function resetCountersIfNeeded(user: User): boolean {
    let changed = false;
    const now = new Date();

    if (new Date(user.messagesResetAt) <= now) {
        user.messagesUsed = 0;
        user.messagesResetAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        changed = true;
    }

    const todayStr = now.toISOString().split("T")[0];
    const resetStr = user.quizzesResetAt.split("T")[0];
    if (resetStr !== todayStr) {
        user.quizzesUsedToday = 0;
        user.quizzesResetAt = now.toISOString();
        changed = true;
    }

    if (user.tier === "premium" && user.premiumExpiresAt && new Date(user.premiumExpiresAt) <= now) {
        user.tier = "free";
        user.premiumExpiresAt = null;
        changed = true;
    }

    return changed;
}

export async function createUser(email: string, password: string, name: string): Promise<{ user: SafeUser; token: string }> {
    const store = getStore(USERS_STORE);
    const existing = await store.get(email.toLowerCase(), { type: "json" });
    if (existing) throw new Error("An account with this email already exists");

    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    if (!email.includes("@")) throw new Error("Invalid email address");

    const { hash, salt } = hashPassword(password);
    const now = new Date();

    const user: User = {
        id: randomBytes(16).toString("hex"),
        email: email.toLowerCase(),
        name,
        passwordHash: hash,
        salt,
        tier: "free",
        premiumExpiresAt: null,
        messagesUsed: 0,
        messagesResetAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        quizzesUsedToday: 0,
        quizzesResetAt: now.toISOString(),
        createdAt: now.toISOString(),
    };

    await store.setJSON(email.toLowerCase(), user);
    const token = await createSession(user);
    return { user: toSafeUser(user), token };
}

export async function loginUser(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const store = getStore(USERS_STORE);
    const user = await store.get(email.toLowerCase(), { type: "json" }) as User | null;
    if (!user) throw new Error("Invalid email or password");

    const { hash } = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) throw new Error("Invalid email or password");

    resetCountersIfNeeded(user);
    await store.setJSON(email.toLowerCase(), user);

    const token = await createSession(user);
    return { user: toSafeUser(user), token };
}

async function createSession(user: User): Promise<string> {
    const store = getStore(SESSIONS_STORE);
    const token = generateToken();
    const session: Session = {
        userId: user.id,
        email: user.email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    await store.setJSON(token, session);
    return token;
}

export async function validateSession(token: string): Promise<SafeUser | null> {
    if (!token) return null;
    const sessStore = getStore(SESSIONS_STORE);
    const session = await sessStore.get(token, { type: "json" }) as Session | null;
    if (!session) return null;
    if (new Date(session.expiresAt) <= new Date()) {
        await sessStore.delete(token);
        return null;
    }

    const userStore = getStore(USERS_STORE);
    const user = await userStore.get(session.email, { type: "json" }) as User | null;
    if (!user) return null;

    if (resetCountersIfNeeded(user)) {
        await userStore.setJSON(session.email, user);
    }

    return toSafeUser(user);
}

export async function incrementMessageCount(email: string): Promise<{ allowed: boolean; used: number; limit: number }> {
    const store = getStore(USERS_STORE);
    const user = await store.get(email, { type: "json" }) as User | null;
    if (!user) return { allowed: false, used: 0, limit: 0 };

    resetCountersIfNeeded(user);

    const limit = user.tier === "premium" ? Infinity : 15;
    if (user.messagesUsed >= limit) {
        return { allowed: false, used: user.messagesUsed, limit: 15 };
    }

    user.messagesUsed++;
    await store.setJSON(email, user);
    return { allowed: true, used: user.messagesUsed, limit: user.tier === "premium" ? -1 : 15 };
}

export async function incrementQuizCount(email: string): Promise<{ allowed: boolean; used: number; limit: number }> {
    const store = getStore(USERS_STORE);
    const user = await store.get(email, { type: "json" }) as User | null;
    if (!user) return { allowed: false, used: 0, limit: 0 };

    resetCountersIfNeeded(user);

    if (user.tier === "free") {
        return { allowed: false, used: 0, limit: 0 };
    }

    user.quizzesUsedToday++;
    await store.setJSON(email, user);
    return { allowed: true, used: user.quizzesUsedToday, limit: -1 };
}

export async function upgradeToPremium(email: string): Promise<SafeUser> {
    const store = getStore(USERS_STORE);
    const user = await store.get(email, { type: "json" }) as User | null;
    if (!user) throw new Error("User not found");

    user.tier = "premium";
    user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await store.setJSON(email, user);
    return toSafeUser(user);
}

export async function deleteSession(token: string): Promise<void> {
    const store = getStore(SESSIONS_STORE);
    await store.delete(token);
}
