"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user && !["/login", "/register"].includes(pathname)) {
            alert("Bạn cần đăng nhập!");
            router.push("/login");
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) return null;
    if (!user && !["/login", "/register"].includes(pathname)) return null;
    return <>{children}</>;
}
