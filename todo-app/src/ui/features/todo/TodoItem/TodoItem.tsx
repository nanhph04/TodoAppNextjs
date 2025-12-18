"use client";
import styles from "./TodoItem.module.css";
import React from "react";
import { Todo } from "@/data/interfaces/todos";
import Button from "@/ui/components/Common/Button/Button.base";
import { useRouter } from "next/navigation";

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: string) => Promise<void>;
    onToggleDetailed?: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onDelete }: TodoItemProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const isCompleted = todo.status === "completed";
    const router = useRouter();
    const todoId = todo._id || todo.id;

    // Derived UI state (memoized) to keep JSX simple and avoid stale state
    const priorityClass = React.useMemo(() => {
        switch (todo.priority) {
            case "low":
                return styles["priority-low"];
            case "medium":
                return styles["priority-medium"];
            case "high":
                return styles["priority-high"];
            default:
                return "";
        }
    }, [todo.priority]);

    const statusLabel = React.useMemo(() => {
        if (isCompleted) return "Completed";
        return todo.status === "in-progress" ? "In Progress" : "Pending";
    }, [isCompleted, todo.status]);

    const statusClass = React.useMemo(() => (
        isCompleted ? styles["status-completed"] : styles["status-pending"]
    ), [isCompleted]);

    const createdAtLabel = React.useMemo(() => (
        todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "N/A"
    ), [todo.createdAt]);

    const completedAtLabel = React.useMemo(() => (
        isCompleted && todo.completedAt ? new Date(todo.completedAt).toLocaleDateString() : null
    ), [isCompleted, todo.completedAt]);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            if (todo._id) {
                await onDelete(todo._id);
            } else {
                throw new Error("Todo ID is missing");
            }
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = () => {
        if (!todoId) {
            setError("Todo ID is missing");
            return;
        }
        router.push(`/todo/${todoId}`);
    };

    return (
        <div className={styles["todo-card"]}>
            <div className={styles["todo-content"]}>
                <p className={styles["todo-title"]}>{todo.title}</p>
                <p className={styles["todo-description"]}>{todo.description}</p>
            </div>
            <div className={styles["todo-status"]}>
                <p>Piority: <span className={priorityClass}>{todo.priority}</span></p>
                <p>Status: <span className={statusClass}>{statusLabel}</span></p>
                <p>Created at: <span className={styles["todo-createdAt"]}>{createdAtLabel}</span></p>
                {completedAtLabel && (
                    <p>Completed at: <span className={styles["todo-completedAt"]}>{completedAtLabel}</span></p>
                )}
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <Button
                        className={styles["todo-btn"]}
                        onClick={handleViewDetails}
                        title="Cập nhật"
                    ></Button>
                    <Button
                        className={styles["todo-btn"]}
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ background: "#ef4444", color: "#fff", borderRadius: 6, padding: "6px 18px", border: "none", cursor: "pointer" }}
                        title="Xóa"
                    ></Button>
                </div>
                {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
            </div>
        </div>
    );
}
