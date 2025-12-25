"use client";
import React from "react";
import style from "./TodoStatus.module.css";
import ProgressCircle from "@/ui/components/Common/ProgressCircle/ProgressCircle";
import { MdOutlineTask } from "react-icons/md";
import { todoService } from "@/data/services/todo.service";



export default function TodoStatus() {
    const [todoCount, setTodoCount] = React.useState(0);
    const [inProgressCount, setInProgressCount] = React.useState(0);
    const [doneCount, setDoneCount] = React.useState<number>(0);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        async function fetchStatus() {
            setLoading(true);
            setError("");
            try {
                const res = await todoService.countStatus();
                const data = res;
                console.log("Todo status data:", data);
                setTodoCount(data?.todo || 0);
                setInProgressCount(data?.inProgress || 0);
                setDoneCount(data?.done || 0);
                setTotalCount(data?.total || 0);
            } catch (err: any) {
                setError(err.message || "Lỗi tải trạng thái");
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    // Tính phần trăm trạng thái
    const todoPercent = totalCount > 0 ? Math.round((todoCount / totalCount) * 100) : 0;
    const inProgressPercent = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
    const donePercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    return (
        <div className={style['todo-status-container']}>
            <div className={style.TodoStatusHeader}>
                <MdOutlineTask size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                <p> Todo Status</p>
            </div>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <div className={style['progress-circles']}>
                    <ProgressCircle
                        percent={todoPercent}
                        color="#F21E1E"
                        title={`Todo (${todoCount})`}
                        size={100} strokeWidth={8}
                    />
                    <ProgressCircle
                        percent={inProgressPercent}
                        color="#FF9800"
                        title={`In Progress (${inProgressCount})`}
                        size={100} strokeWidth={8}
                    />
                    <ProgressCircle
                        percent={donePercent}
                        color="#00ba00"
                        title={`Done (${doneCount})`}
                        size={100} strokeWidth={8}
                    />
                    <ProgressCircle
                        percent={100}
                        color="#0225FF"
                        title={`Total (${totalCount})`}
                        size={100} strokeWidth={8}
                    />
                </div>
            )}
        </div>
    );
}