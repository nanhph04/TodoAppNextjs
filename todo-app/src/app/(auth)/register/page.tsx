import { AuthProvider } from '@/context/AuthContext';
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout';
import RegisterForm from '@/components/features/auth/RegisterForm/RegisterForm';
export default function RegisterPage() {
    return (
        <AuthProvider>
            <AuthLayout reverse imageSrc="/assets/images/img-auth-2.png">
                <RegisterForm />
            </AuthLayout>
        </AuthProvider>
    );
}
