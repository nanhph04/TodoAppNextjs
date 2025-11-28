import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import styles from "./SocialLink.module.css";

interface SocialLinkProps {
    text?: string;
}

export default function SocialLink({ text }: SocialLinkProps) {
    return (
        <div className={styles.socialLink}>
            <span>{text}</span>
            <Link href=""><FcGoogle fontSize={24} /></Link>
        </div>
    );
}
