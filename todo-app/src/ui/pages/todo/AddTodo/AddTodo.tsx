"use client";
import React from "react";
import style from "./AddTodo.module.css";
import { useTodoForm } from "@/logic/hooks/useTodoForm";
import { useAuth } from "@/logic/stores/AuthContext";
import { addTodo as addTodoService } from "@/data/services/todo.service";

interface AddTodoProps {
    onAdded?: () => void;
}
export default function AddTodo({ onAdded }: AddTodoProps) {
    const {
        form,
        loading,
        error,
        setLoading,
        setError,
        handleChange,
        resetForm,
    } = useTodoForm();
    const { user } = useAuth();

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setLoading(true);
        setError(null);
        try {
            if (!user) {
                const localData = localStorage.getItem('guest_todos');
                const todos = localData ? JSON.parse(localData) : [];
                let newId = "";
                if (typeof crypto !== "undefined" && crypto.randomUUID) {
                    newId = crypto.randomUUID();
                } else {
                    newId = Date.now().toString() + Math.random().toString(36).slice(2);
                }
                todos.push({
                    ...form,
                    _id: newId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                localStorage.setItem('guest_todos', JSON.stringify(todos));
            } else {
                const payload = {
                    title: form.title,
                    description: form.description,
                    priority: form.priority
                };
                console.log("Payload gửi đi addTodoService:", payload);
                await addTodoService(payload);
            }
            resetForm();
            if (onAdded) onAdded();
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style["addtodo-container"]}>
            <h2 className={style["addtodo-title"]}>Add New Task</h2>
            <form onSubmit={handleAddTodo} className={style["addtodo-form"]}>
                <div className={style["addtodo-fields"]}>
                    <div className={style["addtodo-field"]}>
                        <label className={style["addtodo-label"]}>Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={handleChange("title")}
                            placeholder="Enter title..."
                            disabled={loading}
                            className={style["addtodo-input"]}
                        />
                    </div>
                    <div className={style["addtodo-field"]}>
                        <label className={style["addtodo-label"]}>Priority</label>
                        <div className={style["priority-group"]}>
                            <label className={style["priority-extreme"]}>
                                <input
                                    type="checkbox"
                                    checked={form.priority === "high"}
                                    onChange={() => handleChange("priority")({ target: { name: "priority", value: "high" } } as any)}
                                    disabled={loading}
                                /> Extreme
                            </label>
                            <label className={style["priority-moderate"]}>
                                <input
                                    type="checkbox"
                                    checked={form.priority === "medium"}
                                    onChange={() => handleChange("priority")({ target: { name: "priority", value: "medium" } } as any)}
                                    disabled={loading}
                                /> Moderate
                            </label>
                            <label className={style["priority-low"]}>
                                <input
                                    type="checkbox"
                                    checked={form.priority === "low"}
                                    onChange={() => handleChange("priority")({ target: { name: "priority", value: "low" } } as any)}
                                    disabled={loading}
                                /> Low
                            </label>
                        </div>
                    </div>
                    <div className={style["addtodo-field"]}>
                        <label className={style["addtodo-label"]}>Task Description</label>
                        <textarea
                            value={form.description}
                            onChange={handleChange("description")}
                            placeholder="Start writing here..."
                            disabled={loading}
                            className={style["addtodo-textarea"]}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`${style["addtodo-btn"]}${loading ? " " + style["addtodo-btn-loading"] : ""}`}
                >
                    {loading ? "Đang thêm..." : "Done"}
                </button>
                {error && <div className={style["addtodo-error"]}>{error}</div>}
            </form>
        </div>
    );
}
