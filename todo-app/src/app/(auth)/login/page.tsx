"use client";
import AuthLayout from '@/app/(auth)/layout';
import LoginForm from '@/components/features/auth/LoginForm/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.replace("/profile");
        }
    }, [user, router]);
    if (user) return null;
    return (
        <AuthLayout imageSrc="/assets/images/img-auth-1.png">
            <LoginForm />
        </AuthLayout>
    );
}
