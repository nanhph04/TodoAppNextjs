import React from "react";

export default function Header() {
    return (
        <header className="header">
            <div className="header_brand">
                <h2>Dashoard</h2>
            </div>
            <div className="header_search">
                <div className="search-box">
                    <input type="text" placeholder="search" />
                </div>
            </div>
            <div className="header_btn">
                <button>Thông báo</button>
                <button>Lịch</button>
            </div>
            <div className="header_date">
                <span>Thứ 3</span>
                <span>26/11/2025</span>
            </div>
        </header>
    );
}