"use client";
import React from "react";

export interface Column<T = any> {
    key: keyof T | string;
    label: string;
    render?: (row: T, value: any, rowIndex: number) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: number | string;
}

interface TableBaseProps<T = any> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    footer?: React.ReactNode;
    getRowKey?: (row: T, index: number) => string;
}

export default function TableBase<T = any>({
    columns,
    data,
    loading = false,
    emptyText = "Không có dữ liệu",
    footer,
    getRowKey,
}: TableBaseProps<T>) {
    const rowKey = (row: T, idx: number) => (getRowKey ? getRowKey(row, idx) : String(idx));

    return (
        <div style={{ width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                        {columns.map((col, i) => (
                            <th
                                key={`th-${i}-${String(col.key)}`}
                                style={{ border: "1px solid #ddd", padding: 8, textAlign: col.align ?? "left", width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} style={{ border: "1px solid #ddd", padding: 12 }}>
                                Đang tải...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ border: "1px solid #ddd", padding: 12, color: "#777" }}>
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, ri) => (
                            <tr key={rowKey(row, ri)}>
                                {columns.map((col, ci) => {
                                    const key = col.key as any;
                                    const value = (row as any)[key];
                                    return (
                                        <td key={`td-${ri}-${ci}`} style={{ border: "1px solid #ddd", padding: 8, textAlign: col.align ?? "left" }}>
                                            {col.render ? col.render(row, value, ri) : value ?? "-"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
                {footer && (
                    <tfoot>
                        <tr>
                            <td colSpan={columns.length} style={{ borderTop: "1px solid #ddd", padding: 8 }}>{footer}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

