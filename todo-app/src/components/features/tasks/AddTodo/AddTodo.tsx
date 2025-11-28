"use client";
import React from "react";
import "./AddTodo.css";
import { useTodoForm } from "@/hooks/useTodoForm";
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

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setLoading(true);
        setError(null);
        try {
            await addTodoService(form);
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
