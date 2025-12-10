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
import { syncTodos } from '@/data/services/todo.service';
import { useAuth } from '@/logic/stores/AuthContext';
import { useRouter } from 'next/navigation';
import { userService } from '@/data/services/user.service';

export default function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
            return '';
        };

        const accessToken = getCookie('accessToken');
        if (accessToken) {
            const handleGoogleLoginSuccess = async () => {
                setLoading(true);
                try {
                    // Gọi API lấy thông tin user

                    const userInfo = await userService.getUserProfile().then(r => r.data);
                    // Đăng nhập
                    login(accessToken, userInfo);
                    await syncLocalTodosToServer();
                    // router.push('/');
                } catch (err) {
                    console.error("Google login sync error", err);
                    setError('Lỗi đồng bộ dữ liệu sau khi đăng nhập Google');
                } finally {
                    setLoading(false);
                }
            };
            handleGoogleLoginSuccess();
        }
    }, [login, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const getLocalTodos = () => {
        const localData = localStorage.getItem('guest_todos');
        return localData ? JSON.parse(localData) : [];
    };

    const syncLocalTodosToServer = async () => {
        const localTodos = getLocalTodos();
        if (localTodos.length > 0) {
            try {
                await syncTodos({ localTodos });
                localStorage.removeItem('guest_todos');
            } catch (syncErr) {
                console.error('Error syncing local todos:', syncErr);
            }
        }
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
                await syncLocalTodosToServer();
                login(accessToken, null);
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
                            console.log('Response từ loginWithGoogle:', res);
                            const { accessToken } = res.data;
                            const userInfo = await userService.getUserProfile().then(r => r.data);
                            login(accessToken, userInfo);
                            // await syncLocalTodosToServer();
                            // router.push('/todo');
                        } catch (err) {
                            setError('Đăng nhập Google thất bại');
                            // Không reload hoặc chuyển trang khi lỗi
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