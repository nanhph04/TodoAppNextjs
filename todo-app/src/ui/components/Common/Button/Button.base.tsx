
interface ButtonProps {
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}
export default function Button({ title, onClick, disabled, className, icon }: ButtonProps) {
    return <button onClick={onClick} disabled={disabled} className={className}>{icon}{title}</button>
}