"use client";
import AuthLayout from '@/app/(auth)/layout';
import LoginForm from '@/ui/pages/auth/LoginForm/LoginForm';
import { useAuth } from '@/logic/stores/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, router]);
    if (user) return null;
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
