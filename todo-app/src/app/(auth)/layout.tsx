import style from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={style.loginLayoutContainer}>
            <div className={style.loginLayoutLeft}>{children}</div>
        </div>
    );
}
