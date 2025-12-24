
import React from "react";

interface ButtonProps {
    title?: string;
    onClick?: (() => void | Promise<void>) | React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    type?: "button" | "submit" | "reset";
}

export default function Button({ title, onClick, disabled, className, icon, children, style, type = "button" }: ButtonProps) {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> | undefined = onClick
        ? (e) => {
            // Call provided handler regardless of its signature
            (onClick as any)(e);
        }
        : undefined;

    return (
        <button type={type} onClick={handleClick} disabled={disabled} className={className} style={style}>
            {icon}
            {children ?? title}
        </button>
    );
}