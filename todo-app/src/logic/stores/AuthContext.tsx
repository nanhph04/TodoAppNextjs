"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "@/data/services/auth.service";
import { useRouter } from "next/navigation";
import { userService } from "@/data/services/user.service";
import { User } from "@/data/interfaces/users";
import { Permission } from "@/data/interfaces/permission";

export interface AuthContextType {
    user: User | null;
    permissions: string[];
    accessToken: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const setAuthData = useCallback(async (token: string | null) => {
        if (!token) {
            setUser(null);
            setPermissions([]);
            setAccessToken(null);
            localStorage.removeItem("accessToken");
            return;
        }

        setAccessToken(token);
        localStorage.setItem("accessToken", token);

        const [userRes, permRes] = await Promise.all([
            userService.getUserProfile(),
            userService.getUserPermissions(),
        ]);
        setUser(userRes.data);
        setPermissions(permRes.data || []);

    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem("accessToken");
                if (storedToken) {
                    await setAuthData(storedToken);
                }
            } catch (error) {
                console.error("Init auth failed", error);
                await setAuthData(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [setAuthData]);



    const login = async (token: string) => {
        await setAuthData(token);
        localStorage.setItem("accessToken", token);
        router.push("/todo");
    };

    const logout = async () => {
        try {
            await authService.logout();
            await setAuthData(null);
            localStorage.removeItem("accessToken");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            await setAuthData(null);
            router.push("/login");
            localStorage.removeItem("accessToken");
        }
    };

    const hasPermission = useCallback(
        (permission: string) => {
            return (
                permissions.includes("*:*") ||
                permissions.includes(permission)
            );
        },
        [permissions]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                permissions,
                accessToken,
                isLoading,
                login,
                logout,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

