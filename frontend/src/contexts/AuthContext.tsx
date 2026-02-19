import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
    User,
    getSession,
    clearSession,
    loginUser as loginService,
    registerUser as registerService,
    updateUser as updateService,
} from '../services/storageService';

type SafeUser = Omit<User, 'passwordHash'>;

interface AuthContextType {
    user: SafeUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (updates: Partial<Pick<User, 'name' | 'email'>>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => { },
    updateProfile: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SafeUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // RESTORE SESSION OR DEV BYPASS
    useEffect(() => {
        const session = getSession();
        if (session) {
            setUser(session);
        } else {
            // DEV: Bypass auth if no session exists
            const AUTH_BYPASS = true;
            if (AUTH_BYPASS) {
                setUser({
                    id: 'dev-user-123',
                    name: 'Dev User',
                    email: 'dev@pharmaguard.ai',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        // Simulate network latency
        await new Promise(r => setTimeout(r, 600));
        const result = loginService(email, password);
        if (result.success && result.user) {
            const { passwordHash, ...safe } = result.user;
            setUser(safe);
        }
        return { success: result.success, error: result.error };
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        await new Promise(r => setTimeout(r, 600));
        const result = registerService(name, email, password);
        if (result.success && result.user) {
            const { passwordHash, ...safe } = result.user;
            setUser(safe);
        }
        return { success: result.success, error: result.error };
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setUser(null);
    }, []);

    const updateProfile = useCallback((updates: Partial<Pick<User, 'name' | 'email'>>) => {
        if (!user) return;
        const updated = updateService(user.id, updates);
        if (updated) {
            const { passwordHash, ...safe } = updated;
            setUser(safe);
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
