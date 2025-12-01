import React from "react";
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
                    <input type="text" placeholder="search" />
                    <button><FaSearch /></button>
                </div>
            </div>
            <div className="header_btn">
                <button><FaBell /></button>
                <button><FaCalendarAlt /></button>
            </div>
            <div className="header_date">
                <p>Thứ 3</p>
                <p className="date">26/11/2025</p>
            </div>
        </header>
    );
}