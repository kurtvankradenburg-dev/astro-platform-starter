import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    town: string;
    role: string;
    points: number;
    streak: number;
    lastLoginDate?: string;
    joinedAt: string;
    avatar?: string;
    notificationsEnabled?: boolean;
    notificationLevel?: 'all' | 'critical' | 'none';
    showOnLeaderboard?: boolean;
    language?: string;
    aiTone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, town: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {},
    signup: async () => {},
    logout: () => {},
    updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

const TOWNS = [
    'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
    'Bloemfontein', 'Polokwane', 'Nelspruit', 'Kimberley', 'East London',
    'Soweto', 'Sandton', 'Centurion', 'Midrand', 'Randburg',
    'Upington', 'Stellenbosch', 'Paarl', 'George', 'Knysna',
    'Rustenburg', 'Pietermaritzburg', 'Mbombela', 'Mahikeng', 'Mthatha',
    'Grahamstown', 'Limpopo', 'Tzaneen', 'Thohoyandou', 'Musina',
    'Klerksdorp', 'Potchefstroom', 'Vereeniging', 'Benoni', 'Boksburg',
    'Springs', 'Witbank', 'Secunda', 'Standerton', 'Ermelo',
    'Newcastle', 'Richards Bay', 'Empangeni', 'Ladysmith', 'Vryheid',
    'Welkom', 'Kroonstad', 'Bethlehem', 'Queenstown', 'Graaff-Reinet',
    'Oudtshoorn', 'Mossel Bay', 'Hermanus', 'Worcester', 'Bredasdorp',
    'Beaufort West', 'Clanwilliam', 'Springbok', 'De Aar', 'Colesberg',
    'Aliwal North', 'Cradock', 'Uitenhage', 'Jeffreys Bay', 'Plettenberg Bay',
    'Lephalale', 'Mokopane', 'Giyani', 'Phalaborwa', 'Bela-Bela',
    'Thabazimbi', 'Brits', 'Hartbeespoort', 'Sun City', 'Zeerust'
];

export { TOWNS };

function computeStreak(lastLoginDate: string | undefined, currentStreak: number): { streak: number; lastLoginDate: string } {
    const today = new Date().toDateString();
    if (!lastLoginDate) return { streak: 1, lastLoginDate: today };
    const last = new Date(lastLoginDate).toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    if (last === today) return { streak: currentStreak, lastLoginDate: today };
    if (last === yesterdayStr) return { streak: currentStreak + 1, lastLoginDate: today };
    return { streak: 1, lastLoginDate: today };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('ecocity_user');
        if (stored) {
            try {
                const parsed: User = JSON.parse(stored);
                // Update streak on app load (daily login)
                const { streak, lastLoginDate } = computeStreak(parsed.lastLoginDate, parsed.streak);
                const pointsBonus = streak > (parsed.streak || 0) ? 5 : 0;
                const updated = { ...parsed, streak, lastLoginDate, points: (parsed.points || 0) + pointsBonus };
                setUser(updated);
                localStorage.setItem('ecocity_user', JSON.stringify(updated));
            } catch {
                setLoading(false);
            }
        }
        setLoading(false);
    }, []);

    const persistUser = useCallback((u: User | null) => {
        setUser(u);
        if (u) localStorage.setItem('ecocity_user', JSON.stringify(u));
        else localStorage.removeItem('ecocity_user');
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const { login: idLogin } = await import('@netlify/identity');
            const idUser = await idLogin(email, password);
            const storedRaw = localStorage.getItem('ecocity_user');
            const stored: Partial<User> = storedRaw ? JSON.parse(storedRaw) : {};
            const { streak, lastLoginDate } = computeStreak(stored.lastLoginDate, stored.streak || 0);
            const u: User = {
                id: idUser.id || crypto.randomUUID(),
                email: idUser.email || email,
                name: idUser.name || email.split('@')[0],
                town: (idUser.userMetadata?.town as string) || stored.town || 'Johannesburg',
                role: (idUser.userMetadata?.role as string) || 'citizen',
                points: (stored.points || 0) + 5,
                streak,
                lastLoginDate,
                joinedAt: idUser.createdAt || stored.joinedAt || new Date().toISOString(),
                notificationsEnabled: stored.notificationsEnabled,
                notificationLevel: stored.notificationLevel || 'all',
                showOnLeaderboard: stored.showOnLeaderboard !== false,
                language: stored.language || 'en',
                aiTone: stored.aiTone || 'helpful',
            };
            persistUser(u);
        } catch {
            const storedRaw = localStorage.getItem('ecocity_user');
            const stored: Partial<User> = storedRaw ? JSON.parse(storedRaw) : {};
            const { streak, lastLoginDate } = computeStreak(stored.lastLoginDate, stored.streak || 0);
            const isReturning = !!stored.email && stored.email === email;
            const u: User = {
                id: stored.id || crypto.randomUUID(),
                email,
                name: stored.name || email.split('@')[0],
                town: stored.town || 'Johannesburg',
                role: stored.role || 'citizen',
                points: (stored.points || 0) + (isReturning ? 5 : 0),
                streak: isReturning ? streak : 1,
                lastLoginDate: isReturning ? lastLoginDate : new Date().toDateString(),
                joinedAt: stored.joinedAt || new Date().toISOString(),
                notificationsEnabled: stored.notificationsEnabled,
                notificationLevel: stored.notificationLevel || 'all',
                showOnLeaderboard: stored.showOnLeaderboard !== false,
                language: stored.language || 'en',
                aiTone: stored.aiTone || 'helpful',
            };
            persistUser(u);
        }
    }, [persistUser]);

    const signup = useCallback(async (email: string, password: string, name: string, town: string) => {
        try {
            const { signup: idSignup } = await import('@netlify/identity');
            const idUser = await idSignup(email, password, { full_name: name, town, role: 'citizen', points: '0', streak: '0' });
            const u: User = {
                id: idUser.id || crypto.randomUUID(),
                email: idUser.email || email,
                name,
                town,
                role: 'citizen',
                points: 0,
                streak: 1,
                lastLoginDate: new Date().toDateString(),
                joinedAt: new Date().toISOString(),
                notificationLevel: 'all',
                showOnLeaderboard: true,
                language: 'en',
                aiTone: 'helpful',
            };
            persistUser(u);
        } catch {
            const u: User = {
                id: crypto.randomUUID(),
                email,
                name,
                town,
                role: 'citizen',
                points: 0,
                streak: 1,
                lastLoginDate: new Date().toDateString(),
                joinedAt: new Date().toISOString(),
                notificationLevel: 'all',
                showOnLeaderboard: true,
                language: 'en',
                aiTone: 'helpful',
            };
            persistUser(u);
        }
    }, [persistUser]);

    const logout = useCallback(async () => {
        try {
            const { logout: idLogout } = await import('@netlify/identity');
            await idLogout();
        } catch {}
        persistUser(null);
    }, [persistUser]);

    const updateUser = useCallback((updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            localStorage.setItem('ecocity_user', JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
