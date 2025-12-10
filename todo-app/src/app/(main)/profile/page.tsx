"use client";
import { useAuth } from '@/logic/stores/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth || (!auth.accessToken && !auth.isLoading)) {
            router.push("/login");
        }
    }, [auth, router]);

    if (!auth || auth.isLoading) {
        return null;
    }
    if (!auth.user) {
        return null;
    }
    const { user, logout } = auth;
    return (

        <div>
            <h1>User Profile</h1>
            <h2>Fullname: {user.fullName || "Không có tên"}</h2>
            <h2>Email: {user.email || "Không có email"}</h2>
            <button onClick={logout}>Log out</button>
        </div>

    );
}