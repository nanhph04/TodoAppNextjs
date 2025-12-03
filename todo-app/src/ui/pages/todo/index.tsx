"use client";
import React, { useState } from "react";
import TodoListContainer from "@/ui/pages/todo/TodoListContainer/TodoListContainer";
import AddTodo from "@/ui/pages/todo/AddTodo/AddTodo";

export default function TodoPage() {
    const [showAdd, setShowAdd] = useState(false);
    const handleOpen = () => setShowAdd(true);
    const handleClose = () => setShowAdd(false);

    return (
        <div>
            <button onClick={handleOpen} style={{ marginBottom: 16, padding: "8px 20px", fontSize: "1rem", borderRadius: 6, background: "#ff9800", color: "#fff", border: "none", cursor: "pointer" }}>Thêm công việc mới</button>
            {showAdd && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.15)", padding: 32, minWidth: 400, position: "relative" }}>
                        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                        <AddTodo onAdded={handleClose} />
                    </div>
                </div>
            )}
            <TodoListContainer />
        </div>
    );
}
