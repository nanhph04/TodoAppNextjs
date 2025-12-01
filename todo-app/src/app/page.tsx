import Link from "next/dist/client/link";
import style from "./page.module.css";

export default function Home() {
    return (
        <div className={style.container}>
            <div className={style.content}>
                <h1 className={style.title}>Welcome to the Todo App</h1>
                <p className={style.description}>This is the home page.</p>
                <Link href="/todo" className={style.link}>Go to Todo List</Link>
                <Link href="/login" className={style.link}>Go to Login</Link>
            </div>
        </div>
    );
}