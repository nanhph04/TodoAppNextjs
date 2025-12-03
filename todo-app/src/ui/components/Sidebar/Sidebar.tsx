"use client";
import React from "react";
import style from "./Sidebar.module.css";
import Link from "next/link";
import { useAuth } from "@/logic/stores/AuthContext";
import { userService } from "@/data/services/user.service";
import { usePathname } from "next/navigation";
import { MdLogout, MdLogin } from "react-icons/md";

export default function Sidebar() {
    const auth = useAuth();
    const pathname = usePathname();
    const fullName = auth.user?.fullname || auth.user?.fullName || auth.user?.name || "Guest";
    const isLoggedIn = !!auth.user;

    const handleLogout = async () => {
        if (auth?.logout) await auth.logout();
    };

    return (
        <div className={style.sidebar}>
            <div className={style["user-info"]}>
                <h2 className={style["user-name"]}>{fullName}</h2>
            </div>
            <div>
                <div className={style.menu}>
                    <Link href="/" className={`${style["menu-item"]} ${pathname === "/" ? style["active"] : ""}`}>Dashboard</Link>
                    <Link href="/todo" className={`${style["menu-item"]} ${pathname.startsWith("/todo") ? style["active"] : ""}`}>Tasks</Link>
                    {isLoggedIn && (
                        <Link href="/profile" className={`${style["menu-item"]} ${pathname.startsWith("/profile") ? style["active"] : ""}`}>Profile</Link>
                    )}
                </div>
            </div>
            <div className={style["sidebar-footer"]}>
                {isLoggedIn ? (
                    <div className={style.logout} onClick={handleLogout} style={{ cursor: "pointer" }}><MdLogout /> Logout</div>
                ) : (
                    <Link href="/login" className={style.logout} style={{ cursor: "pointer" }}><MdLogin />Log in</Link>
                )}
            </div>
        </div>
    );
}