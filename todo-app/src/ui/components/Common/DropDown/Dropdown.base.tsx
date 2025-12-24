"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type AnyItem = any;

interface DropdownProps {
    items: AnyItem[];
    selected: string[];
    onChange: (next: string[]) => void;
    getKey: (item: AnyItem) => string;
    getLabel: (item: AnyItem) => string;
    placeholder?: string;
    emptyText?: string;
    searchPlaceholder?: string;
    maxWidth?: number;
    maxHeight?: number;
    countLabel?: (count: number) => string;
    visibleItemCount?: number; // number of items to show before scrolling
    itemHeight?: number; // approximate row height in px
}

export default function Dropdown({
    items,
    selected,
    onChange,
    getKey,
    getLabel,
    placeholder = "Chọn...",
    emptyText = "Không có dữ liệu",
    searchPlaceholder = "Tìm...",
    maxWidth = 520,
    maxHeight = 300,
    countLabel = (c) => `Đã chọn ${c} mục`,
    visibleItemCount = 7,
    itemHeight = 36,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);
    const [openUp, setOpenUp] = useState(false);
    const [listMaxH, setListMaxH] = useState<number>(maxHeight);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((it) => getLabel(it)?.toLowerCase().includes(q));
    }, [items, query, getLabel]);

    const toggleValue = (val: string) => {
        const exists = selected.includes(val);
        onChange(
            exists ? selected.filter((v) => v !== val) : [...selected, val]
        );
    };

    const selectAllShown = () => {
        const all = filtered.map((it) => getKey(it)).filter(Boolean);
        const next = Array.from(new Set([...selected, ...all]));
        onChange(next);
    };

    const clearAll = () => onChange([]);

    // compute dropdown direction and max height based on viewport
    useEffect(() => {
        function recompute() {
            if (!ref.current) return;
            const trigger = ref.current.getBoundingClientRect();
            const viewportH = window.innerHeight;
            const spaceBelow = viewportH - trigger.bottom;
            const spaceAbove = trigger.top;
            const shouldOpenUp = spaceBelow < 240 && spaceAbove > spaceBelow;
            setOpenUp(shouldOpenUp);
            const available = (shouldOpenUp ? spaceAbove : spaceBelow) - 24; // padding/margins
            const desired = Math.floor(visibleItemCount * itemHeight);
            const minH = Math.max(itemHeight * 3, 120);
            const computed = Math.max(minH, Math.min(maxHeight, Math.floor(available), desired));
            setListMaxH(computed);
        }
        if (open) {
            recompute();
            window.addEventListener("resize", recompute);
            window.addEventListener("scroll", recompute, true);
            return () => {
                window.removeEventListener("resize", recompute);
                window.removeEventListener("scroll", recompute, true);
            };
        }
    }, [open, maxHeight, visibleItemCount, itemHeight]);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                style={{
                    width: "100%",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    background: "#fff",
                    padding: "8px 10px",
                    borderRadius: 8,
                }}
            >
                {selected.length > 0 ? countLabel(selected.length) : placeholder}
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: openUp ? "auto" : "100%",
                        bottom: openUp ? "100%" : "auto",
                        left: 0,
                        width: "100%",
                        maxWidth,
                        marginTop: openUp ? 0 : 6,
                        marginBottom: openUp ? 6 : 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 10,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        zIndex: 10,
                    }}
                >
                    <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        <input
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <button
                                type="button"
                                onClick={selectAllShown}
                                style={{ padding: "6px 10px", border: "1px solid #ddd", background: "#f7f7f7", borderRadius: 6 }}
                            >
                                Chọn tất cả (hiển thị)
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                style={{ padding: "6px 10px", border: "1px solid #ddd", background: "#f7f7f7", borderRadius: 6 }}
                            >
                                Bỏ chọn tất cả
                            </button>
                        </div>
                    </div>
                    <div style={{ maxHeight: listMaxH, overflowY: "auto" }}>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                            {filtered.length === 0 && (
                                <li style={{ padding: 10, color: "#777" }}>{emptyText}</li>
                            )}
                            {filtered.map((it) => {
                                const value = getKey(it);
                                const label = getLabel(it);
                                const checked = selected.includes(value);
                                return (
                                    <li key={`dd-item-${value}`} style={{ display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #f7f7f7" }}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleValue(value)}
                                            style={{ marginRight: 10 }}
                                        />
                                        <span style={{ flex: 1 }}>{label}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

