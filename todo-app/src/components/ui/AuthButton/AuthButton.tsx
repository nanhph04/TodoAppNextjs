import styles from "./AuthButton.module.css";

interface AuthButtonProps {
    label?: string;
}

export default function AuthButton({ label = "Login" }: AuthButtonProps) {
    return (
        <div className={styles.authButtonWrapper}>
            <button type="submit" className={styles.authButton}>{label}</button>
        </div>
    );
}
