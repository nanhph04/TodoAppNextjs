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
        // Chỉ gọi refreshToken nếu chưa có user
        if (!user) {
            const initAuth = async () => {
                try {
                    const res = await authService.refreshToken();
                    const { accessToken, user } = res.data;
                    setAccessToken(accessToken);
                    setUser(user || { name: "User from Token" });
                } catch (error) {
                    console.log("Phiên đăng nhập hết hạn");
                } finally {
                    setIsLoading(false);
                }
            };
            initAuth();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const login = (token: string, userData: any) => {
        setAccessToken(token);
        setUser(userData);
        router.push("/profile");
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