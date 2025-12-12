"use client";
import styles from "./TodoItem.module.css";
import React from "react";
import { Todo } from "@/data/interfaces/todos";

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: string) => Promise<void>;
    onToggleComplete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onDelete, onToggleComplete }: TodoItemProps) {
    const [loading, setLoading] = React.useState(false);
    const [toggleLoading, setToggleLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

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

    const handleToggleStatus = async () => {
        setToggleLoading(true);
        setError(null);
        try {
            if (todo._id) {
                await onToggleComplete(todo._id);
            } else {
                throw new Error("Todo ID is missing");
            }
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setToggleLoading(false);
        }
    };

    return (
        <div className={styles["todo-card"]}>
            <div className={styles["todo-content"]}>
                <p className={styles["todo-title"]}>{todo.title}</p>
                <p className={styles["todo-description"]}>{todo.description}</p>
            </div>
            <div className={styles["todo-status"]}>
                <p>Piority: <span
                    className={
                        todo.priority === "low" ? styles["priority-low"] :
                            todo.priority === "medium" ? styles["priority-medium"] :
                                todo.priority === "high" ? styles["priority-high"] : ""
                    }
                >{todo.priority}</span></p>
                <p>Status: <span
                    className={todo.completed ? styles["status-completed"] : styles["status-pending"]}
                >{todo.completed ? "Completed" : "Pending"}</span></p>
                <p>Created at: <span className={styles["todo-createdAt"]}>{todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "N/A"}</span></p>
                {todo.completed && todo.completedAt && (
                    <p>Completed at: <span className={styles["todo-completedAt"]}>{new Date(todo.completedAt).toLocaleDateString()}</span></p>
                )}
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button
                        className={styles["todo-btn"]}
                        onClick={handleToggleStatus}
                        disabled={toggleLoading}
                        style={{ background: todo.completed ? "#aaa" : "#2563eb", color: "#fff", borderRadius: 6, padding: "6px 18px", border: "none", cursor: "pointer" }}
                    >{todo.completed ? "Mark as Pending" : "Mark as Completed"}</button>
                    <button
                        className={styles["todo-btn"]}
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ background: "#ef4444", color: "#fff", borderRadius: 6, padding: "6px 18px", border: "none", cursor: "pointer" }}
                    >Delete</button>
                </div>
                {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
            </div>
        </div>
    );
}
