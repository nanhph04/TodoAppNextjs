import "./Header.css";
import { FaSearch, FaCalendarAlt, FaBell } from "react-icons/fa";

export default function Header() {
    return (
        <header className="header">
            <div className="header_brand">
                <h2>Dashoard</h2>
            </div>
            <div className="header_search">
                <div className="search-box">
                    <input type="text" placeholder="Tìm kiếm nhiệm vụ" />
                    <button><FaSearch /></button>
                </div>
            </div>
            <div className="header_btn">
                <button><FaBell /></button>
                <button><FaCalendarAlt /></button>
            </div>
            <div className="header_date">
                {(() => {
                    const now = new Date();
                    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
                    const dayName = days[now.getDay()];
                    const dateStr = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
                    return <>
                        <p>{dayName}</p>
                        <p className="date">{dateStr}</p>
                    </>;
                })()}
            </div>
        </header>
    );
}