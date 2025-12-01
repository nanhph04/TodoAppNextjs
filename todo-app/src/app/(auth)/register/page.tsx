import AuthLayout from '@/app/(auth)/layout';
import RegisterForm from '@/components/features/auth/RegisterForm/RegisterForm';
export default function RegisterPage() {
    return (
        <AuthLayout reverse imageSrc="/assets/images/img-auth-2.png">
            <RegisterForm />
        </AuthLayout>
    );
}
