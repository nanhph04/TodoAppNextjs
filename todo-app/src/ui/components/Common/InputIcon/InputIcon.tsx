import React from "react";
import styles from "./InputIcon.module.css";


interface Props extends React.InputHTMLAttributes<HTMLInputElement> {

    icon: React.ReactNode;
}
export default function InputIcon({ icon, value, id, name, type, ...props }: Props) {
    return (
        <div className={styles.inputIcon}>
            {icon}
            <input
                value={value}
                id={id}
                name={name}
                type={type}
                {...props}
            />
        </div>
    );
}
