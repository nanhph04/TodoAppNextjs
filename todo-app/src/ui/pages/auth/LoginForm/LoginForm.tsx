'use client';
import Link from 'next/link';
import style from '../AuthForm.module.css';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import InputWithIcon from '@/ui/components/Common/InputIcon/InputIcon';
import SocialLoginRow from '@/ui/components/Common/SocialLink/SocialLink';
import LoginButton from '@/ui/components/Common/AuthButton/AuthButton';
import { useState } from 'react';
import { authService } from '@/data/services/auth.service';
import { syncTodos } from '@/data/services/todo.service';
import { useAuth } from '@/logic/stores/AuthContext';
import { useAxiosAuthSync } from '@/logic/libs/axiosClient';
export default function LoginForm() {
    const { login } = useAuth();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                console.log('Dữ liệu truyền đi syncTodos:', localTodos);
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
                useAxiosAuthSync();
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
                <LoginButton label={loading ? 'Đang đăng nhập...' : 'Login'} />
            </form>
            <footer className={style.loginFormFooter}>
                <SocialLoginRow text="Or, Login with" />
                <span>Don't have an account? <Link href="/register" style={{ color: '#008BD9', fontSize: '1rem', fontWeight: '500' }}>Create one</Link></span>
            </footer>
        </section>
    );
}