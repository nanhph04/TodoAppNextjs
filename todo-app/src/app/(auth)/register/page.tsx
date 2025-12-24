import AuthLayout from '@/app/(auth)/layout';
import RegisterForm from '@/ui/features/auth/RegisterForm/RegisterForm';
export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}
