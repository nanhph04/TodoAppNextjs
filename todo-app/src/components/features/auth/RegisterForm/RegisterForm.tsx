'use client';
import Link from 'next/link';
import style from '../AuthForm.module.css';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import InputWithIcon from '@/components/ui/InputIcon/InputIcon';
import SocialLoginRow from '@/components/ui/SocialLink/SocialLink';
import LoginButton from '@/components/ui/AuthButton/AuthButton';
import { FaUserPen } from "react-icons/fa6";
import { useState } from 'react';
import { authService } from '@/services/auth.server';
import { useAuth } from '@/context/AuthContext';
export default function RegisterForm() {
    const { login } = useAuth();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.fullName || !form.email || !form.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        setLoading(true);
        try {
            const res = await authService.register({
                fullName: form.fullName,
                email: form.email,
                password: form.password
            });
            // Nếu backend trả về accessToken và user
            const { accessToken, user } = res.data;
            if (accessToken && user) {
                login(accessToken, user);
            } else {
                setError('Đăng ký thành công, vui lòng đăng nhập');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={style.loginFormContainer}>
            <header className={style.loginFormHeader}>
                <h2>Sign Up</h2>
            </header>
            <form className={style.loginForm} onSubmit={handleSubmit}>
                <InputWithIcon icon={<FaUserPen />} type="text" placeholder="Enter your fullname" name="fullName" value={form.fullName} onChange={handleChange} />
                <InputWithIcon icon={<MdEmail />} type="email" placeholder="Enter your email" name="email" value={form.email} onChange={handleChange} />
                <InputWithIcon icon={<RiLockPasswordFill />} type="password" placeholder="Enter your password" name="password" value={form.password} onChange={handleChange} />
                <LoginButton label={loading ? 'Đang đăng ký...' : 'Sign Up'} />
            </form>
            <footer className={style.loginFormFooter}>
                <SocialLoginRow />
                <span>Already have an account? <Link href="/login" style={{ color: '#008BD9', fontSize: '1rem', fontWeight: '500' }}>Sign in</Link></span>
            </footer>
        </section>
    );
}