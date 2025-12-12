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
    role: string;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const getUserIdFromToken = (token: string): string => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.sub || decoded.userId || decoded._id || decoded.id || '';
    } catch {
        return "";
    }
}

const getRoleFromToken = (token: string): string => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.role || "";
    } catch {
        return "";
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessTokenState] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState<string>("");
    const router = useRouter();

    const setAuthData = useCallback((token: string, userData: User | null) => {
        const userId = getUserIdFromToken(token);
        const role = getRoleFromToken(token);
        setAccessTokenState(token);
        setUser(userData);
        setUserId(userId);
        setRole(role);

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
                setRole(getRoleFromToken(storedToken));
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
                    setRole(res.data?.role || "");
                } catch {
                    setAuthData("", null);
                    setRole("");
                }
            } else {
                setAuthData("", null);
                setRole("");
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
            localStorage.removeItem('accessToken');
            console.log("Logout successful");
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, userId, role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

