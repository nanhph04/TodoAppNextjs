"use client";
import styles from "./TodoItem.module.css";
import React from "react";
import { Todo } from "@/data/interfaces/todos";
import Button from "@/ui/components/Common/Button/Button.base";
import { todoService } from "@/data/services/todo.service";
import { useAuth } from "@/logic/hooks/useAuth";
import { useRouter } from "next/navigation";

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: string) => Promise<void>;
    onToggleDetailed?: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onDelete }: TodoItemProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showReject, setShowReject] = React.useState(false);
    const [rejectReason, setRejectReason] = React.useState("");
    const isCompleted = todo.status === "DONE";
    const router = useRouter();
    const todoId = todo._id;
    const { user } = useAuth();
    console.log("[DEBUG] assignee:", todo.assignee, "createdBy:", todo.createdBy, "userId:", user?.userId);
    const isAssignee = user?.userId && (
        (typeof todo.assignee === "object" ? todo.assignee?._id : todo.assignee) === user.userId
    );
    console.log("Todo Item - user:", user, "todo:", todo);
    const isCreator = user?.userId && (
        (typeof todo.createdBy === "object" ? todo.createdBy?._id : todo.createdBy) === user.userId
    );
    console.log("Todo Item - isAssignee:", isAssignee, "isCreator:", isCreator);
    const canRespond = !!isAssignee && !isCreator && todo.status === "TODO";

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
        switch (todo.status) {
            case "REJECTED":
                return "rejected";
            case "DONE":
                return "done";
            case "IN_PROGRESS":
                return "inprogress";
            case "TODO":
            default:
                return "todo";
        }
    }, [todo.status]);

    const statusClass = React.useMemo(() => {
        switch (todo.status) {
            case "DONE":
                return styles["status-completed"];
            case "IN_PROGRESS":
                return styles["status-inprogress"];
            case "TODO":
            default:
                return styles["status-pending"];
        }
    }, [todo.status]);

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

    const handleAccept = async () => {
        if (!todoId) return;
        setLoading(true);
        setError(null);
        try {
            await todoService.updateTodo(String(todoId), { status: "IN_PROGRESS" });
            router.refresh();
        } catch (err: any) {
            setError(err?.message || "Không thể xác nhận công việc");
        } finally {
            setLoading(false);
        }
    };

    const handleRejectSubmit = async () => {
        if (!todoId) return;
        if (!rejectReason.trim()) {
            setError("Vui lòng nhập lý do từ chối");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const trimmedRejectReason = rejectReason.trim();
            await todoService.updateTodo(String(todoId), { rejectReason: trimmedRejectReason, status: "REJECTED" });
            setShowReject(false);
            setRejectReason("");
            router.refresh();
        } catch (err: any) {
            setError(err?.message || "Không thể gửi từ chối");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["todo-card"]}>
            <div className={styles["todo-header"]}>
                <p>Người tạo: <span className={styles["todo-creator"]}>{
                    typeof todo.createdBy === "object" ? todo.createdBy.fullName : "N/A"
                }</span></p>
                <p>Người nhận: <span className={styles["todo-assignee"]}>{
                    typeof todo.assignee === "object" ? todo.assignee.fullName : "N/A"
                }</span></p>
            </div>
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
                <div className={styles["todo-actions"]}>
                    <Button
                        className={styles["todo-btn"]}
                        onClick={handleViewDetails}
                        title="Chi tiết"
                    ></Button>
                    {canRespond && (
                        <>
                            <Button
                                className={styles["todo-btn"]}
                                onClick={handleAccept}
                                disabled={loading}
                                title="Xác nhận"
                            ></Button>
                            <Button
                                className={styles["todo-btn"]}
                                onClick={() => setShowReject((v) => !v)}
                                disabled={loading}
                                title="Từ chối"
                            ></Button>
                        </>
                    )}
                    {(todo.status === "DONE" || todo.status === "REJECTED") && (
                        <Button
                            className={`${styles["todo-btn"]} ${styles["btn-danger"]}`}
                            onClick={handleDelete}
                            disabled={loading}
                            title="Xóa"
                        ></Button>
                    )}
                </div>
                {showReject && (
                    <div className={styles["reject-form"]}>
                        <textarea
                            className={styles["reject-textarea"]}
                            placeholder="Nhập lý do từ chối..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            disabled={loading}
                        />
                        <div className={styles["reject-actions"]}>
                            <button className={styles["btn-secondary"]} onClick={() => setShowReject(false)} disabled={loading}>Hủy</button>
                            <button className={styles["btn-danger"]} onClick={handleRejectSubmit} disabled={loading}>Gửi từ chối</button>
                        </div>
                    </div>
                )}
                {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
            </div>
        </div>
    );
}
