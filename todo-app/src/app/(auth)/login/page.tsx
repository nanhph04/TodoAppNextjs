"use client";
import AuthLayout from '@/app/(auth)/layout';
import LoginForm from '@/ui/pages/auth/LoginForm/LoginForm';
import { useAuth } from '@/logic/stores/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



export default function LoginPage() {
    const { accessToken } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (accessToken) {
            router.replace("/");
        }
    }, [accessToken, router]);
    if (accessToken) return null;
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
