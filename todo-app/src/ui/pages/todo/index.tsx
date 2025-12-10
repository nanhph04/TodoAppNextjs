import TodoListContainer from "@/ui/pages/todo/TodoListContainer/TodoListContainer";
import style from "./TodoPage.module.css";
import TodoStatus from "@/ui/pages/todo/TodoStatus/TodoStatus"; export default function TodoPage() {
    return (
        <div className={style.todoPageContainer}>
            <TodoListContainer />

            <TodoStatus />
        </div>
    );
}
