"use client";
import TodoList from "@/ui/features/todo/TodoList/TodoList";
import styles from "@/ui/features/todo/TodoListContainer/TodoListContainer.module.css";
import { useTodos } from "@/logic/hooks/useTodos";
import React from "react"
import AddTodoModal from "./AddTodoModal";
import { FaPlus } from "react-icons/fa";
import { LuFileClock } from "react-icons/lu";
import Button from "@/ui/components/Common/Button/Button.base";

export default function TodoListContainer() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const {
        todos,
        totalPages,
        loading,
        error,
        refreshTodos,
        deleteTodo,
    } = useTodos(currentPage);
    const [showAdd, setShowAdd] = React.useState(false);
    const handleOpen = () => setShowAdd(true);
    const handleClose = () => {
        setShowAdd(false);
        refreshTodos();
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className={styles['page-container']}>Đang tải...</div>;
    }
    if (error) {
        return (
            <div className={styles['page-container']}>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    return (
        <div className={styles['todolist-container']}>
            <div className={styles['todo-list-container-top']}>
                <div className={styles['page-title']}>
                    <LuFileClock />
                    <p>Todo</p>
                </div>
                <Button
                    className={styles['add-todo-btn']}
                    onClick={handleOpen}
                    icon={<FaPlus color="#F24E1E" />}
                    title="Thêm công việc mới"
                />
                <AddTodoModal open={showAdd} onClose={handleClose} />
            </div>
            <div className={styles['todolist-content']}>
                <TodoList
                    todos={todos}
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onDelete={deleteTodo}
                />
            </div>
        </div>
    );

}

