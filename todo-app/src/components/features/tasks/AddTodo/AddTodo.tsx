"use client";
import React from "react";
import "./AddTodo.css";
import { useTodoForm } from "@/hooks/useTodoForm";
import { useAuth } from "@/context/AuthContext";
import { addTodo as addTodoService } from "@/services/todo.service";

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
                // Chỉ lưu vào localStorage nếu chưa đăng nhập
                const localData = localStorage.getItem('guest_todos');
                const todos = localData ? JSON.parse(localData) : [];
                let newId = "";
                if (typeof crypto !== "undefined" && crypto.randomUUID) {
                    newId = crypto.randomUUID();
                } else {
                    newId = Date.now().toString() + Math.random().toString(36).slice(2);
                }
                todos.push({ ...form, completed: false, _id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
                localStorage.setItem('guest_todos', JSON.stringify(todos));
            } else {
                await addTodoService(form);
            }
            resetForm();
            onAdded?.();
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleAddTodo} className="addtodo-form">
            <h2 className="addtodo-title">Thêm công việc mới</h2>
            <div className="addtodo-fields">
                <div className="addtodo-field">
                    <label className="addtodo-label">Tiêu đề</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={handleChange("title")}
                        placeholder="Nhập tiêu đề..."
                        disabled={loading}
                        className="addtodo-input"
                    />
                </div>
                <div className="addtodo-field">
                    <label className="addtodo-label">Mô tả</label>
                    <input
                        type="text"
                        value={form.description}
                        onChange={handleChange("description")}
                        placeholder="Nhập mô tả..."
                        disabled={loading}
                        className="addtodo-input"
                    />
                </div>
                <div className="addtodo-field">
                    <label className="addtodo-label">Độ ưu tiên</label>
                    <select
                        value={form.priority}
                        onChange={handleChange("priority")}
                        disabled={loading}
                        className="addtodo-select"
                    >
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`addtodo-btn${loading ? " addtodo-btn-loading" : ""}`}
            >
                {loading ? "Đang thêm..." : "Thêm mới"}
            </button>
            {error && <div className="addtodo-error">{error}</div>}
        </form>
    );
}
