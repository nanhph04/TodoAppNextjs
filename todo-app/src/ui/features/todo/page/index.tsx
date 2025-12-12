import TodoListContainer from "@/ui/features/todo/TodoListContainer/TodoListContainer";
import style from "./TodoPage.module.css";
import TodoStatus from "@/ui/features/todo/TodoStatus/TodoStatus";

export default function TodoPage() {
    return (
        <div className={style.todoPageContainer}>
            <TodoListContainer />
            <TodoStatus />
        </div>
    );
}
