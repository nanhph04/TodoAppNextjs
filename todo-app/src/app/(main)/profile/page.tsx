"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MainLayout from '../layout';

export default function ProfilePage() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth || (!auth.user && !auth.isLoading)) {
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
            <h2>Fullname: {user.fullname || user.fullName || user.name || "Không có tên"}</h2>
            <h2>Email: {user.email || "Không có email"}</h2>
            <button onClick={logout}>Log out</button>
        </div>

    );
}