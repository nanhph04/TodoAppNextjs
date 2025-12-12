
import AddTodo from "@/ui/features/todo/AddTodo/AddTodo";
import styles from "./TodoListContainer.module.css";

interface AddTodoModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddTodoModal({ open, onClose }: AddTodoModalProps) {
    if (!open) return null;
    return (
        <div className={styles['add-todo-modal-overlay']} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div className={styles['add-todo-modal']} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.15)", padding: 32, minWidth: 400, position: "relative" }}>
                <button
                    className={styles['close-modal-btn']}
                    onClick={onClose}
                    style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
                >
                    &times;
                </button>
                <AddTodo onAdded={onClose} />
            </div>
        </div>
    );
}
