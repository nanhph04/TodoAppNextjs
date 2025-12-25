"use client";
import React, { useEffect, useState } from "react";
import { roleService } from "@/data/services/role.service";
import { permissionService } from "@/data/services/permission.service";
import AddRole from "@/ui/features/role/AddRole/AddRole";
import TableBase, { Column } from "@/ui/components/Common/Table/Table.base";
import Link from "next/link";

interface Role {
    _id: string;
    name: string;
    description: string;
    permissions: { _id?: string; slug?: string; }[];
    users?: { _id: string; email: string; }[];
}

interface Permission {
    _id?: string;
    slug?: string;
    description?: string;
}

export default function RolePage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    // AddRole handled via component

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError("");
            try {
                const [roleRes, permRes] = await Promise.all([
                    roleService.getRoles(),
                    permissionService.getPermissions()
                ]);
                setRoles(roleRes.data);
                const permsData = Array.isArray(permRes.data)
                    ? permRes.data
                    : (permRes.data?.permissions ?? permRes.data?.data ?? permRes.data?.items ?? []);
                setPermissions(permsData);
            } catch (err: any) {
                setError(err.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const reloadRoles = async () => {
        try {
            const roleRes = await roleService.getRoles();
            setRoles(roleRes.data);
        } catch (err: any) {
            setError(err.message || "Lỗi tải danh sách role");
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h1>Role Management</h1>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <button onClick={() => setShowAdd(v => !v)} style={{ marginBottom: 16 }}>
                {showAdd ? "Đóng" : "Thêm role mới"}
            </button>
            {showAdd && (
                <AddRole
                    permissions={permissions}
                    onClose={() => setShowAdd(false)}
                    onSuccess={() => { setShowAdd(false); reloadRoles(); }}
                />
            )}
            {(() => {
                const columns: Column<Role>[] = [
                    { key: "_id", label: "ID" },
                    { key: "name", label: "Name" },

                    // {
                    //     key: "permissions",
                    //     label: "Permissions",
                    //     render: (row) =>
                    //         row.permissions && row.permissions.length > 0 ? (
                    //             <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    //                 {row.permissions.map((p, i) => (
                    //                     <li key={`${row._id}-perm-${(p as any)._id ?? (p as any).slug ?? i}`}>{(p as any).slug ?? (p as any)._id}</li>
                    //                 ))}
                    //             </ul>
                    //         ) : (
                    //             "-"
                    //         ),
                    // },
                    {
                        key: "actions",
                        label: "Actions",
                        render: (row) => (
                            <Link href={`/role/${row._id}`} style={{ color: "#2563eb" }}>
                                Xem chi tiết
                            </Link>
                        ),
                    },
                ];

                return (
                    <TableBase<Role>
                        columns={columns}
                        data={roles}
                        loading={loading}
                        emptyText="Không có dữ liệu"
                        getRowKey={(row) => row._id}
                    />
                );
            })()}
        </div>
    );
}