import { useEffect, useRef } from 'react';

interface GoogleButtonProps {
    onSuccess: (token: string) => void;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; 
console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined');
}

const GoogleButton = ({ onSuccess }: GoogleButtonProps) => {
    const btnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.google && btnRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response: any) => {
                    const token = response.credential;
                    if (token) {
                        onSuccess(token);
                    }
                },
            });
            window.google.accounts.id.renderButton(
                btnRef.current,
                { theme: 'outline', size: 'large' }
            );
        }
    }, [onSuccess]);

    return <div ref={btnRef} style={{ margin: '16px 0' }}></div>;
};

export default GoogleButton;