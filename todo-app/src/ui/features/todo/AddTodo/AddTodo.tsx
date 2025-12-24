"use client";
import React, { useState } from "react";
import style from "./AddTodo.module.css";
import { useForm } from "@/logic/hooks/useForm";
import { useAuth } from "@/logic/hooks/useAuth";
import { todoService } from "@/data/services/todo.service";
import { userService } from "@/data/services/user.service";
// import { handleApiError } from "@/logic/utils/errorHandler";
// Nếu không có type Priority, dùng trực tiếp:
type Priority = "low" | "medium" | "high";

interface AddTodoProps {
    onAdded?: () => void;
    assigneeList?: { email: string; id: string }[];
}

export default function AddTodo({ onAdded, assigneeList }: AddTodoProps) {
    const {
        form,
        loading,
        error,
        setLoading,
        setError,
        handleChange,
        resetForm,
        setForm,
    } = useForm();
    // setPriority helper tại chỗ, không phụ thuộc useTodoForm
    const setPriority = (value: Priority) => {
        setForm((prev: any) => ({ ...prev, priority: value }));
    };
    const { user } = useAuth();
    const [assigneeEmail, setAssigneeEmail] = useState<string>("");
    const [assigneeError, setAssigneeError] = useState<string>("");


    const [optimisticTodos, setOptimisticTodos] = useState<any[]>([]);
    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setLoading(true);
        setError(null);
        setAssigneeError("");
        try {
            let assigneeId = user?._id;
            if (assigneeEmail.trim()) {
                const res = await userService.getUserByEmail(assigneeEmail.trim());
                if (!res.data || !res.data._id) {
                    setAssigneeError("Email không tồn tại trong hệ thống");
                    return;
                }
                assigneeId = res.data._id;
            }
            const payload = {
                title: form.title,
                description: form.description,
                priority: form.priority as Priority,
                assignee: assigneeId
            };
            // Optimistic UI: add to local list
            setOptimisticTodos(prev => [
                { ...payload, _id: Math.random().toString(36).slice(2), optimistic: true },
                ...prev
            ]);
            await todoService.addTodo(payload);
            resetForm();
            setAssigneeEmail("");
            if (onAdded) onAdded();
        } catch (err: any) {
            // const msg = handleApiError(err);
            setAssigneeError("An error occurred while adding the todo.");
            setError(err.message || "An error occurred while adding the todo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style["addtodo-container"]}>
            <h2 className={style["addtodo-title"]}>Add New Task</h2>
            <form onSubmit={handleAddTodo} className={style["addtodo-form"]}>
                <div className={style["addtodo-fields"]}>
                    <div className={style['addtodo-field']}>
                        <label className={style['addtodo-label']}>Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={handleChange("title")}
                            placeholder="Enter title..."
                            disabled={loading}
                            className={style["addtodo-input"]}
                        />
                    </div>
                    <div className={style['addtodo-field']}>
                        <label className={style['addtodo-label']}>Assignee Email</label>
                        <input
                            type="email"
                            value={assigneeEmail}
                            onChange={e => setAssigneeEmail(e.target.value)}
                            placeholder={user?.email || "Nhập email người nhận việc"}
                            disabled={loading}
                            className={style['addtodo-input']}
                        />
                        {assigneeError && <div className={style['addtodo-error']}>{assigneeError}</div>}
                        <div className="text-xs text-gray-500 mt-1">Để trống để tự giao cho mình</div>
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
                    <div className={style["addtodo-field"]}>
                        <label className={style["addtodo-label"]}>Priority</label>
                        <div className={style["priority-group"]}>
                            <label className={style["priority-extreme"]}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="high"
                                    checked={form.priority === "high"}
                                    onChange={() => setPriority("high")}
                                    disabled={loading}
                                /> Extreme
                            </label>
                            <label className={style["priority-moderate"]}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="medium"
                                    checked={form.priority === "medium"}
                                    onChange={() => setPriority("medium")}
                                    disabled={loading}
                                /> Moderate
                            </label>
                            <label className={style["priority-low"]}>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="low"
                                    checked={form.priority === "low"}
                                    onChange={() => setPriority("low")}
                                    disabled={loading}
                                /> Low
                            </label>
                        </div>
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
