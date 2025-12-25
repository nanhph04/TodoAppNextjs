"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTodos } from "@/logic/hooks/useTodos";
import type { Todo } from "@/data/interfaces/todos";
import DetailTodo, { TodoFormState, TodoStatus } from "@/ui/features/todo/DetailTodo/DetailTodo";

export default function TodoDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { findById, update, loading, error } = useTodos(1);

    const [todo, setTodo] = useState<Todo | null>(null);
    const [form, setForm] = useState<TodoFormState>({
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
                status: (data.status as TodoStatus) || "TODO",
            });
        });
    }, [id, findById]);

    // Xác nhận (IN_PROGRESS)
    const handleAccept = async () => {
        if (!todo?._id) return;
        try {
            setSaving(true);
            const updated = await update(todo._id, { ...form, status: "IN_PROGRESS" });
            if (updated) {
                setTodo(updated);
                setForm({
                    description: updated.description || "",
                    status: updated.status as TodoStatus,
                });
                setMessage("Đã xác nhận công việc");
            } else {
                setMessage("Có lỗi xảy ra khi xác nhận");
            }
        } catch {
            setMessage("Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    // Từ chối (REJECTED, có lý do)
    const handleReject = async (reason: string) => {
        if (!todo?._id) return;
        try {
            setSaving(true);
            const updated = await update(todo._id, { ...form, status: "REJECTED", rejectReason: reason });
            if (updated) {
                setTodo(updated);
                setForm({
                    description: updated.description || "",
                    status: updated.status as TodoStatus,
                });
                setMessage("Đã từ chối công việc");
            } else {
                setMessage("Có lỗi xảy ra khi từ chối");
            }
        } catch {
            setMessage("Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    // Hoàn thành (DONE)
    const handleDone = async () => {
        if (!todo?._id) return;
        try {
            setSaving(true);
            const updated = await update(todo._id, { ...form, status: "DONE" });
            if (updated) {
                setTodo(updated);
                setForm({
                    description: updated.description || "",
                    status: updated.status as TodoStatus,
                });
                setMessage("Đã hoàn thành công việc");
            } else {
                setMessage("Có lỗi xảy ra khi hoàn thành");
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
        <div>
            <DetailTodo
                todo={todo}
                form={form}
                setForm={setForm}
                saving={saving}
                onSave={async () => {
                    if (form.status === "TODO") {
                        await handleAccept();
                    } else if (form.status === "REJECTED") {
                        await handleReject(form.description); // hoặc truyền rejectReason nếu tách riêng
                    }
                }}
                onMarkDone={handleDone}
            />

            {message && (
                <p className={`mt-4 text-center text-base font-semibold ${message.includes("lỗi") ? "text-red-600" : "text-blue-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}