import React, { useState } from "react";
import styles from "./DetailTodo.module.css";
import type { Todo } from "@/data/interfaces/todos";

// Định nghĩa thống nhất kiểu Status
export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE" | "REJECTED";

export type TodoFormState = {
    description: string;
    status: TodoStatus;
};

interface DetailTodoProps {
    todo: Todo;
    form: TodoFormState;
    setForm: (form: TodoFormState) => void;
    onSave: () => void;
    onMarkDone: () => void;
    saving?: boolean;
    readOnly?: boolean;
}

export default function DetailTodo({
    todo,
    form,
    setForm,
    onSave,
    onMarkDone,
    saving = false,
    readOnly = false,
}: DetailTodoProps) {

    // --- Helper Render Badge ---
    const renderStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            TODO: "bg-yellow-100 text-yellow-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            DONE: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800",
        };
        const labels: Record<string, string> = {
            TODO: "Chưa thực hiện",
            IN_PROGRESS: "Đang thực hiện",
            DONE: "Đã hoàn thành",
            REJECTED: "Đã từ chối",
        };

        const badgeClass =
            status === "TODO"
                ? styles.statusTodo
                : status === "IN_PROGRESS"
                    ? styles.statusInProgress
                    : status === "DONE"
                        ? styles.statusDone
                        : status === "REJECTED"
                            ? styles.statusRejected
                            : styles.statusDefault;
        const label = labels[status] || status;
        return <span className={`${styles.statusBadge} ${badgeClass}`}>{label}</span>;
    };

    const renderPriorityBadge = (priority?: string) => {
        if (!priority) return null;
        const styles: Record<string, string> = {
            low: "bg-green-100 text-green-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
        };
        const labels: Record<string, string> = {
            low: "Thấp",
            medium: "Trung bình",
            high: "Cao",
        };

        const badgeClass =
            priority === "low"
                ? styles.priorityLow
                : priority === "medium"
                    ? styles.priorityMedium
                    : priority === "high"
                        ? styles.priorityHigh
                        : styles.priorityDefault;
        const label = labels[priority] || priority;
        return <span className={`${styles.priorityBadge} ${badgeClass}`}>{label}</span>;
    };

    const isReadOnly = todo.status === "DONE" || todo.status === "REJECTED";
    const [showReject, setShowReject] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7Zm0 2h10v16H7V4Zm2 2v2h2V6H9Zm0 4v2h2v-2H9Zm0 4v2h2v-2H9Zm4-8v2h2V6h-2Zm0 4v2h2v-2h-2Zm0 4v2h2v-2h-2Z" /></svg>
                Chi tiết công việc
            </h1>

            {/* Thông tin Read-only */}
            <div className={styles.infoGrid}>
                <div><b>ID:</b> <span className={styles.textGray}>{todo._id}</span></div>
                <div><b>Người nhận:</b> <span className={styles.textDark}>{typeof todo.assignee === "object" ? todo.assignee.fullName : todo.assignee}</span></div>
                <div><b>Người tạo:</b> <span className={styles.textDark}>{typeof todo.createdBy === "object" ? todo.createdBy.fullName : todo.createdBy}</span></div>
                <div><b>Độ ưu tiên:</b> {renderPriorityBadge(todo.priority)}</div>
                <div><b>Trạng thái:</b> {renderStatusBadge(todo.status || "")}</div>
                <div><b>Lý do từ chối:</b> <span className={styles.textRed}>{todo.rejectReason || "-"}</span></div>
                <div><b>Ngày hết hạn:</b> <span className={styles.textGray}>{todo.dueDate ? new Date(todo.dueDate).toLocaleString() : "-"}</span></div>
                <div><b>Ngày tạo:</b> <span className={styles.textGray}>{todo.createdAt ? new Date(todo.createdAt).toLocaleString() : "-"}</span></div>
                <div><b>Ngày hoàn thành:</b> <span className={styles.textGray}>{todo.completedAt ? new Date(todo.completedAt).toLocaleString() : "-"}</span></div>
            </div>

            {/* Form chỉnh sửa và nút chỉ hiển thị nếu chưa DONE/REJECTED */}
            {!isReadOnly ? (
                <>
                    <div className={styles.formSection}>
                        <p className={styles.titleRow}>
                            <span className={styles.titleIcon}>📝</span>Tiêu đề: <span className={styles.titleText}>{todo.title}</span>
                        </p>

                        <div>
                            <b className={styles.labelBlue}>Mô tả:</b>
                            <textarea
                                className={styles.textarea}
                                rows={3}
                                value={form.description}
                                disabled={saving}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionRow}>
                        {form.status === "TODO" && (
                            <>
                                <button
                                    className={styles.acceptBtn}
                                    disabled={saving}
                                    onClick={onSave}
                                >
                                    Xác nhận
                                </button>
                                <button
                                    className={styles.rejectBtn}
                                    disabled={saving}
                                    onClick={() => setShowReject(true)}
                                >
                                    Từ chối
                                </button>
                            </>
                        )}
                        {form.status === "IN_PROGRESS" && (
                            <button
                                className={styles.doneBtn}
                                disabled={saving}
                                onClick={onMarkDone}
                            >
                                ✅ Hoàn thành
                            </button>
                        )}
                        <button
                            className={styles.backBtn}
                            onClick={() => window.history.back()}
                        >
                            ← Quay lại
                        </button>
                    </div>

                    {/* Reject Reason Modal */}
                    {showReject && (
                        <div className={styles.rejectModal}>
                            <textarea
                                className={styles.rejectTextarea}
                                rows={3}
                                placeholder="Nhập lý do từ chối..."
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                disabled={saving}
                            />
                            {localError && <div className={styles.rejectError}>{localError}</div>}
                            <div className={styles.rejectActions}>
                                <button
                                    className={styles.rejectCancelBtn}
                                    onClick={() => { setShowReject(false); setLocalError(null); }}
                                    disabled={saving}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={styles.rejectSendBtn}
                                    disabled={saving}
                                    onClick={() => {
                                        if (!rejectReason.trim()) {
                                            setLocalError("Vui lòng nhập lý do từ chối");
                                            return;
                                        }
                                        setLocalError(null);
                                        setForm({ ...form, status: "REJECTED", description: form.description });
                                        setShowReject(false);
                                        onSave();
                                    }}
                                >
                                    Gửi từ chối
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.actionRow}>
                    <button
                        className={styles.backBtn}
                        onClick={() => window.history.back()}
                    >
                        ← Quay lại
                    </button>
                </div>
            )}
        </div>
    );
}