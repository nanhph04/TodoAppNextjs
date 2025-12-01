"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth.server";
import { setAccessToken } from "@/libs/axiosClient";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: any;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
            if (token) {
                setAccessToken(token);
                try {
                    const res = await authService.getMe();
                    setUser(res.data);
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (token: string, userData: any) => {
        setAccessToken(token);
        setUser(userData);
        router.push("/");
    };


    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        }
        setAccessToken("");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;