import { AuthProvider } from '@/context/AuthContext';
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout';
import LoginForm from '@/components/features/auth/LoginForm/LoginForm';
export default function LoginPage() {
    return (
        <AuthProvider>
            <AuthLayout imageSrc="/assets/images/img-auth-1.png">
                <LoginForm />
            </AuthLayout>
        </AuthProvider>
    );
}
