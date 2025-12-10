import style from './layout.module.css';
import { AuthProvider } from '@/logic/stores/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={style.loginLayoutContainer}>
            <AuthProvider>
                <div className={style.loginLayoutLeft}>{children}</div>
            </AuthProvider>
        </div>
    );
}
