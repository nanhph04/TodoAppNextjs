"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authService } from "@/data/services/auth.service";
import { useRouter } from "next/navigation";
import { userService } from "@/data/services/user.service";
import { jwtDecode } from "jwt-decode";
import { User } from "@/data/interfaces/users";

interface AuthContextType {
    user: User | null;
    accessToken: string;
    userId: string;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getUserIdFromToken = (token: string): string => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.sub || decoded.userId || decoded._id || decoded.id || '';
    } catch {
        return "";
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenState] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const setAuthData = useCallback((token: string, userData: User | null) => {
        const id = token ? getUserIdFromToken(token) : "";
        setAccessTokenState(token);
        setUser(userData);
        setUserId(id);

        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('accessToken', token);
            } else {
                localStorage.removeItem('accessToken');
            }
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                setAccessTokenState(storedToken);
                setUserId(getUserIdFromToken(storedToken));
                try {
                    const res = await userService.getUserProfile();
                    setUser(res.data);
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                    setAuthData("", null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, [setAuthData]);

    useEffect(() => {
        const handleTokenRefresh = async () => {
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
                try {
                    const res = await userService.getUserProfile();
                    setAuthData(newToken, res.data);
                } catch {
                    setAuthData("", null);
                }
            } else {
                setAuthData("", null);
            }
        };

        window.addEventListener('authTokenRefreshed', handleTokenRefresh);
        return () => window.removeEventListener('authTokenRefreshed', handleTokenRefresh);
    }, [setAuthData]);

    const login = (token: string, userData: User) => {
        setAuthData(token, userData);
        router.push("/todo");
    };

    const logout = async () => {
        const currentId = userId;
        setAuthData("", null);

        try {
            if (currentId) await authService.logout();
            window.dispatchEvent(new Event('authTokenRefreshed'));
            // Chỉ cần 1 trong 2 dòng dưới đây, không nên dùng cả hai!
            // window.location.href = "/login"; // Đảm bảo redirect và reload sạch sẽ
            router.push("/login");
            // và bỏ window.location.reload();
            localStorage.removeItem('accessToken');
            console.log("Logout successful");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, userId, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};