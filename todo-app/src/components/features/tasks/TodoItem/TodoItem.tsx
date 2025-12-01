"use client";
import styles from "./TodoItem.module.css";
import React from "react";
import { Todo } from "../../../../types/todos";

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
            await onDelete(todo._id);
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
            await onToggleComplete(todo._id);
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
                <p>Created at: <span className={styles["todo-createdAt"]}>{new Date(todo.createdAt).toLocaleDateString()}</span></p>
            </div>
        </div>
    );
}
