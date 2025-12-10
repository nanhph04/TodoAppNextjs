import AuthLayout from '@/app/(auth)/layout';
import RegisterForm from '@/ui/pages/auth/RegisterForm/RegisterForm';
export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}
