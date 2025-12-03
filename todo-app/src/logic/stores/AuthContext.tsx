"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/data/services/auth.service";
import { useRouter } from "next/navigation";
import { userService } from "@/data/services/user.service";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: any;
    accessToken: string;
    userId: string;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [accessToken, setAccessTokenState] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
            if (token) {
                setAccessTokenState(token);
                try {
                    let decodedUserId = '';
                    try {
                        const decoded: any = jwtDecode(token);
                        decodedUserId = decoded.sub || decoded.userId || decoded._id || decoded.id || '';
                    } catch {
                        decodedUserId = '';
                    }
                    setUserId(decodedUserId);
                    if (typeof window !== 'undefined' && decodedUserId) {
                        localStorage.setItem('userId', decodedUserId);
                    }
                    let userProfile = null;
                    if (decodedUserId) {
                        const res = await userService.getUserProfile(decodedUserId);
                        userProfile = res.data;
                    }
                    setUser(userProfile);
                } catch {
                    setUser(null);
                    setUserId("");
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('userId');
                    }
                }
            } else {
                setUser(null);
                setAccessTokenState("");
                setUserId("");
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('userId');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (token: string, userData: any) => {
        let decodedUserId = "";
        try {
            const decoded: any = jwtDecode(token);
            decodedUserId = decoded.sub || decoded.userId || decoded._id || decoded.id || '';
        } catch {
            decodedUserId = "";
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            if (decodedUserId) {
                localStorage.setItem('userId', decodedUserId);
            }
        }
        setAccessTokenState(token);
        setUser(userData);
        setUserId(decodedUserId);
        router.push("/");
    };

    const logout = async () => {
        try {
            await authService.logout(userId);
        } catch (error) {
            console.error(error);
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
        }
        setAccessTokenState("");
        setUser(null);
        setUserId("");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, userId, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;