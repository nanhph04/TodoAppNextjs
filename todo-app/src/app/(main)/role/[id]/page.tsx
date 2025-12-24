"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { roleService } from "@/data/services/role.service";
import type { Permission } from "@/data/interfaces/permission";
import { permissionService } from "@/data/services/permission.service";
import Button from "@/ui/components/Common/Button/Button.base";

interface RoleUser { _id?: string; email?: string; }
interface RoleData {
    _id?: string;
    name?: string;
    permissionSlugs?: string[];
    users?: RoleUser[];
}


export default function RoleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [role, setRole] = React.useState<RoleData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>("");
    const [permissions, setPermissions] = React.useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]); // permission._id
    const [showEdit, setShowEdit] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState("");

    React.useEffect(() => {
        async function fetchRole() {
            if (!id) return;
            setLoading(true);
            setError("");
            try {
                const res = await roleService.getRoleById(String(id));
                const data: RoleData = (res?.data?.role ?? res?.data?.data ?? res?.data ?? null) as RoleData;
                setRole(data ?? null);
                // Sau khi đã có permissions, map slug sang _id để tích sẵn
                setTimeout(() => {
                    setSelectedPermissions((prev) => {
                        if (!data?.permissionSlugs || permissions.length === 0) return [];
                        // Tìm các permission có slug nằm trong permissionSlugs, lấy _id
                        return permissions
                            .filter((perm) => data.permissionSlugs?.includes(perm.slug ?? ""))
                            .map((perm) => perm._id ?? "");
                    });
                }, 0);
            } catch (err: any) {
                setError(err?.message || "Không tải được thông tin role");
            } finally {
                setLoading(false);
            }
        }
        fetchRole();
    }, [id, permissions]);

    React.useEffect(() => {
        async function fetchPermissions() {
            try {
                const res = await permissionService.getPermissions();
                setPermissions(res?.data?.permissions ?? res?.data?.data ?? res?.data ?? []);
            } catch {
                setPermissions([]);
            }
        }
        fetchPermissions();
    }, []);

    if (loading) return <div style={{ padding: 24 }}>Đang tải...</div>;
    if (error) return <div style={{ padding: 24, color: "#ef4444" }}>{error}</div>;
    if (!role) return <div style={{ padding: 24, color: "#ef4444" }}>Không tìm thấy role.</div>;

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <button onClick={() => router.push("/role")} style={{ marginBottom: 16 }}>← Quay lại</button>
            <h1 style={{ marginBottom: 12 }}>Thông tin Role</h1>
            <Button title="Cập nhật permission" onClick={() => setShowEdit((v) => !v)} />
            {showEdit && (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);
                        setSaveError("");
                        try {
                            await roleService.updateRole(String(id), { permissionIds: selectedPermissions });
                            // reload role
                            const res = await roleService.getRoleById(String(id));
                            const data: RoleData = (res?.data?.role ?? res?.data?.data ?? res?.data ?? null) as RoleData;
                            console.log(data);
                            setRole(data ?? null);
                            setShowEdit(false);
                        } catch (err: any) {
                            setSaveError(err?.message || "Cập nhật thất bại");
                        } finally {
                            setSaving(false);
                        }
                    }}
                    style={{ margin: "16px 0", padding: 16, border: "1px solid #eee", borderRadius: 8 }}
                >
                    <div style={{ marginBottom: 12 }}>
                        <b>Chọn permissions:</b>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                            {permissions.map((perm) => (
                                <label key={perm._id} style={{ minWidth: 180, display: "flex", alignItems: "center", gap: 6 }}>
                                    <input
                                        type="checkbox"
                                        value={perm._id}
                                        checked={selectedPermissions.includes(perm._id ?? "")}
                                        onChange={(e) => {
                                            const id = perm._id ?? "";
                                            setSelectedPermissions((prev) =>
                                                e.target.checked
                                                    ? [...prev, id]
                                                    : prev.filter((s) => s !== id)
                                            );
                                        }}
                                    />
                                    {perm.slug}
                                    <span style={{ color: "#888", fontSize: 13, marginLeft: 4 }}>
                                        {perm.description}
                                    </span>
                                    <span style={{ color: "#aaa", fontSize: 12, marginLeft: 8 }}>
                                        (ID: {perm._id})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {saveError && <div style={{ color: "#ef4444", marginBottom: 8 }}>{saveError}</div>}
                    <Button type="submit" title={saving ? "Đang lưu..." : "Lưu permissions"} disabled={saving} />
                    <Button type="button" title="Hủy" onClick={() => setShowEdit(false)} style={{ marginLeft: 8 }} />
                </form>
            )}
            <h1 style={{ marginBottom: 12 }}>Chi tiết Role</h1>
            <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                <p><b>ID:</b> {role._id}</p>
                <p><b>Tên:</b> {role.name}</p>
                <div style={{ marginTop: 16 }}>
                    <b>Permissions:</b>
                    {role.permissionSlugs && role.permissionSlugs.length > 0 ? (
                        <ul style={{ margin: 8, paddingLeft: 18 }}>
                            {role.permissionSlugs.map((slug, idx) => (
                                <li key={`${role._id}-perm-${slug}`}>{slug}</li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ color: "#888" }}>Không có permission</div>
                    )}
                </div>
                <div style={{ marginTop: 16 }}>
                    <b>Người dùng:</b>
                    {role.users && role.users.length > 0 ? (
                        <ul style={{ margin: 8, paddingLeft: 18 }}>
                            {role.users.map((u, idx) => (
                                <li key={`${role._id}-user-${u._id ?? idx}`}>{u.email ?? u._id}</li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ color: "#888" }}>Không có người dùng</div>
                    )}
                </div>
            </div>
        </div>
    );
}
