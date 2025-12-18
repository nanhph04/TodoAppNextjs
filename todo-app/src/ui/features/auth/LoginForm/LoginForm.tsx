'use client';
import Link from 'next/link';
import style from '../AuthForm.module.css';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import InputWithIcon from '@/ui/components/Common/InputIcon/InputIcon';
import LoginButton from '@/ui/components/Common/AuthButton/AuthButton';
import { useState, useEffect } from 'react';
import GoogleButton from '@/ui/components/Common/GoogleButton/GoogleButton';
import { authService } from '@/data/services/auth.service';
import { useAuth } from '@/logic/hooks/useAuth';
import { useRouter } from 'next/navigation';
// import { userService } from '@/data/services/user.service';

export default function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) {
            setError('Vui lòng nhập email và mật khẩu');
            return;
        }
        setLoading(true);
        try {
            const res = await authService.login({
                email: form.email,
                password: form.password
            });
            const { accessToken } = res.data;
            if (accessToken) {
                login(accessToken);
            } else {
                setError('Đăng nhập thất bại, vui lòng thử lại');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className={style.loginFormContainer}>
            <header className={style.loginFormHeader}>
                <h2>Sign In</h2>
            </header>
            <form className={style.loginForm} onSubmit={handleSubmit}>
                <InputWithIcon icon={<MdEmail />} type="email" placeholder="Enter your email" name="email" value={form.email} onChange={handleChange} />
                <InputWithIcon icon={<RiLockPasswordFill />} type="password" placeholder="Enter your password" name="password" value={form.password} onChange={handleChange} />
                {error && <div style={{ color: 'red', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{error}</div>}
                <LoginButton label={loading ? 'Processing...' : 'Login'} />
            </form>
            <footer className={style.loginFormFooter}>
                <GoogleButton
                    onSuccess={async (token: string) => {
                        console.log('Google ID token nhận được:', token);
                        setLoading(true);
                        try {
                            const res = await authService.loginWithGoogle(token);
                            // console.log('Response từ loginWithGoogle:', res);
                            const { accessToken } = res.data;
                            login(accessToken);

                        } catch (err) {
                            setError('Đăng nhập Google thất bại');
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
                <span>Don't have an account? <Link href="/register" style={{ color: '#008BD9', fontSize: '1rem', fontWeight: '500' }}>Create one</Link></span>
            </footer>
        </section>
    );
}

export { };
declare global {
    interface Window {
        google?: any;
    }
}