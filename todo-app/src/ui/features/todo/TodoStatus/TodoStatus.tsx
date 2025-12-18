"use client";
import React from "react";
import style from "./TodoStatus.module.css";
import ProgressCircle from "@/ui/components/Common/ProgressCircle/ProgressCircle";
import { MdOutlineTask } from "react-icons/md";
import { todoService } from "@/data/services/todo.service";


export default function TodoStatus() {
    const [completedTodos, setCompletedTodos] = React.useState(0);
    const [notCompletedTodos, setNotCompletedTodos] = React.useState(0);
    const [totalTodos, setTotalTodos] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        async function fetchStatus() {
            setLoading(true);
            setError("");
            try {
                const res = await todoService.countStatus();
                const data = res;
                setCompletedTodos(data?.completed || 0);
                setNotCompletedTodos(data?.notCompleted || 0);
                setTotalTodos(data?.total || 0);
            } catch (err: any) {
                setError(err.message || "Lỗi tải trạng thái");
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    // Tính phần trăm trạng thái
    const completedPercent = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    const notCompletedPercent = totalTodos > 0 ? Math.round((notCompletedTodos / totalTodos) * 100) : 0;
    const totalPercent = 100;

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
                        percent={completedPercent}
                        color="#00ba00"
                        title={`Completed (${completedTodos})`}
                        size={100} strokeWidth={8}
                    />
                    <ProgressCircle
                        percent={notCompletedPercent}
                        color="#F21E1E"
                        title={`Not Completed (${notCompletedTodos})`}
                        size={100} strokeWidth={8}
                    />
                    <ProgressCircle
                        percent={totalPercent}
                        color="#0225FF"
                        title={`Total (${totalTodos})`}
                        size={100} strokeWidth={8}
                    />
                </div>
            )}
        </div>
    );
}