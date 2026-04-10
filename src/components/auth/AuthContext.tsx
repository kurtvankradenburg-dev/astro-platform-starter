import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    town: string;
    role: string;
    points: number;
    streak: number;
    joinedAt: string;
    avatar?: string;
    notificationsEnabled?: boolean;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('ecocity_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {}
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
            const u: User = {
                id: idUser.id || crypto.randomUUID(),
                email: idUser.email || email,
                name: idUser.name || email.split('@')[0],
                town: (idUser.userMetadata?.town as string) || 'Johannesburg',
                role: (idUser.userMetadata?.role as string) || 'citizen',
                points: Number(idUser.userMetadata?.points) || 0,
                streak: Number(idUser.userMetadata?.streak) || 0,
                joinedAt: idUser.createdAt || new Date().toISOString(),
                notificationsEnabled: idUser.userMetadata?.notificationsEnabled === 'true',
            };
            persistUser(u);
        } catch {
            // Fallback for local dev
            const u: User = {
                id: crypto.randomUUID(),
                email,
                name: email.split('@')[0],
                town: 'Johannesburg',
                role: 'citizen',
                points: 0,
                streak: 0,
                joinedAt: new Date().toISOString(),
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
                name: name,
                town: town,
                role: 'citizen',
                points: 0,
                streak: 0,
                joinedAt: new Date().toISOString(),
            };
            if ((idUser as any).emailVerified) {
                persistUser(u);
            } else {
                persistUser(u);
            }
        } catch {
            const u: User = {
                id: crypto.randomUUID(),
                email,
                name,
                town,
                role: 'citizen',
                points: 0,
                streak: 0,
                joinedAt: new Date().toISOString(),
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
