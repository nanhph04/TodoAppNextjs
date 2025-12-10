import style from "./TodoStatus.module.css";
import ProgressCircle from "@/ui/components/Common/ProgressCircle/ProgressCircle";
import { MdOutlineTask } from "react-icons/md";

export default function TodoStatus() {
    return (
        <div className={style['todo-status-container']}>
            <div className={style.TodoStatusHeader}>
                <MdOutlineTask size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                <p> Todo Status</p>
            </div>
            <div className={style['progress-circles']}>
                <ProgressCircle percent={10} color="#00ba00" title="completed" />
                <ProgressCircle percent={30} color="#0225FF" title="in progress" />
                <ProgressCircle percent={60} color="#F21E1E" title="pending" />
            </div>
        </div>
    );
}