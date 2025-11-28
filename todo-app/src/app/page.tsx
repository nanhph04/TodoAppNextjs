import TodoList from "@/components/features/tasks/TodoList/TodoList";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getTodos } from "@/services/todo.service";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] }>; // Next.js 15 nên để Promise
}

export default async function Home({ searchParams }: PageProps) {
    const param = await searchParams;
    const pageSize = 5;
    let page = 1;
    const pageParam = param?.page;

    if (pageParam) {
        const parsed = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10);
        if (!isNaN(parsed) && parsed > 0) page = parsed;
    }

    try {
        const data = await getTodos(page, pageSize);

        const todos = data.todos || [];
        const totalPages = data.totalPages || 1;
        const currentPage = data.page || page;

        if (currentPage > totalPages && totalPages > 0) {
            redirect(`/?page=${totalPages}`);
        }

        return (
            <div className={styles.pageContainer}>
                <TodoList todos={todos} page={currentPage} totalPages={totalPages} />
            </div>
        );

    } catch (error: any) {
        if (error.response?.status === 401) {
            redirect("/login");
        }

        return (
            <div className={styles.pageContainer}>
                <p className="text-red-500">Không thể tải danh sách công việc. Vui lòng thử lại sau.</p>
            </div>
        );
    }
}