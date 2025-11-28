import style from './layout.module.css';
import Image from 'next/image';

interface AuthLayoutProps {
    children: React.ReactNode;
    reverse?: boolean;
    imageSrc: string;
}

export default function AuthLayout({ children, reverse = false, imageSrc }: AuthLayoutProps) {
    return (
        <div className={style.loginLayoutContainer}>
            {reverse ? (
                <>
                    <div className={style.loginLayoutRight}>
                        <Image src={imageSrc} alt="" fill />
                    </div>
                    <div className={style.loginLayoutLeft}>{children}</div>
                </>
            ) : (
                <>
                    <div className={style.loginLayoutLeft}>{children}</div>
                    <div className={style.loginLayoutRight}>
                        <Image src={imageSrc} alt="" fill />
                    </div>
                </>
            )}
        </div>
    );
}
