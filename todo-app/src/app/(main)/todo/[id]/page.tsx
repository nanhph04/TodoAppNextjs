"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTodos } from "@/logic/hooks/useTodos";
import type { Todo } from "@/data/interfaces/todos";

type Status = "TODO" | "IN_PROGRESS" | "DONE";

type EditForm = {
    description: string;
    status: Status;
};

export default function TodoDetail() {
    const { id } = useParams<{ id: string }>();
    const { findById, update, loading, error } = useTodos(1);

    const [todo, setTodo] = useState<Todo | null>(null);
    const [form, setForm] = useState<EditForm>({
        description: "",
        status: "TODO",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!id) return;

        setTodo(null);
        setMessage("");

        findById(id).then((data) => {
            if (!data) {
                setMessage("Không tìm thấy công việc.");
                return;
            }
            setTodo(data);
            setForm({
                description: data.description || "",
                status: data.status as Status,
            });
        });
    }, [id, findById]);

    const handleUpdate = async (payload: Partial<EditForm>) => {
        if (!todo?._id) return;

        try {
            setSaving(true);
            const updated = await update(todo._id, payload);
            if (updated) {
                setTodo(updated);
                setForm({
                    description: updated.description || "",
                    status: updated.status as Status,
                });
                setMessage("Lưu thành công");
            } else {
                setMessage("Có lỗi xảy ra");
            }
        } catch {
            setMessage("Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !todo)
        return <p className="text-center py-8 text-gray-500">Đang tải...</p>;

    if (error)
        return <p className="text-center py-8 text-red-500">{error}</p>;

    if (!todo)
        return <p className="text-center py-8 text-red-500">{message}</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow border">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">
                Chi tiết công việc
            </h1>

            <div className="space-y-4">
                <p>
                    <b>Tiêu đề:</b> {todo.title}
                </p>

                <div>
                    <b>Mô tả:</b>
                    <textarea
                        className="w-full mt-1 border rounded px-3 py-2"
                        rows={3}
                        value={form.description}
                        disabled={saving}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, description: e.target.value }))
                        }
                    />
                </div>

                <div>
                    <b>Trạng thái:</b>
                    <select
                        className="ml-2 border rounded px-2 py-1"
                        value={form.status}
                        disabled={saving || form.status === "DONE"}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, status: e.target.value as Status }))
                        }
                    >
                        <option value="TODO">Chưa thực hiện</option>
                        <option value="IN_PROGRESS">Đang thực hiện</option>
                        <option value="DONE">Đã hoàn thành</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    className="btn-primary"
                    disabled={saving || form.status === "DONE"}
                    onClick={() => handleUpdate(form)}
                >
                    Lưu
                </button>

                {form.status !== "DONE" && (
                    <button
                        className="btn-success"
                        disabled={saving}
                        onClick={() => handleUpdate({ status: "DONE" })}
                    >
                        Hoàn thành
                    </button>
                )}
            </div>

            {message && (
                <p className="mt-4 text-center text-sm text-blue-600">{message}</p>
            )}
        </div>
    );
}
