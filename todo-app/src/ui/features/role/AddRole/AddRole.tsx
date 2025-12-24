"use client";
import React, { useState } from "react";
import Dropdown from "@/ui/components/Common/DropDown/Dropdown.base";
import { roleService } from "@/data/services/role.service";
import type { Permission } from "@/data/interfaces/permission";
import styles from "./AddRole.module.css";

interface AddRoleProps {
    permissions: Permission[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddRole({ permissions, onClose, onSuccess }: AddRoleProps) {
    const [form, setForm] = useState({ name: "", description: "", permissions: [] as string[] });
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    const getPermKey = (p: Permission) => (p._id ?? p.slug ?? "") as string;
    const getPermLabel = (p: Permission) => (p.slug ?? p._id ?? "");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setError("");
        try {
            // Resolve selected values to permission IDs if needed
            const byId = new Map<string, Permission>();
            const bySlug = new Map<string, Permission>();
            for (const p of permissions) {
                if (p._id) byId.set(p._id, p);
                if (p.slug) bySlug.set(p.slug, p);
            }
            const permissionIds = (form.permissions || [])
                .map((v) => {
                    if (byId.has(v)) return v; // already an ID
                    const p = bySlug.get(v);
                    return p?._id || ""; // map slug to id or empty
                })
                .filter(Boolean);

            // Validate ObjectId format (24 hex characters)
            const objectIdRegex = /^[a-fA-F0-9]{24}$/;
            const validIds = permissionIds.filter((id) => objectIdRegex.test(id));
            if (validIds.length === 0) {
                setError("permissionIds must be an array of valid MongoDB IDs");
                return;
            }
            if (validIds.length !== permissionIds.length) {
                setError("Một số permission không hợp lệ. Vui lòng kiểm tra lại.");
                return;
            }

            await roleService.create({
                name: form.name,
                description: form.description,
                permissionIds: validIds,
            });
            onSuccess();
            setForm({ name: "", description: "", permissions: [] });
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            setError(serverMsg || err?.message || "Lỗi thêm role");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Thêm role mới</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">×</button>
                </div>
                <form className={styles.form} onSubmit={submit}>
                    {error && <div className={styles.error}>{error}</div>}
                    <div className={styles.field}>
                        <label className={styles.label}>Tên role</label><br />
                        <input
                            className={styles.input}
                            value={form.name}
                            onChange={e => setForm(r => ({ ...r, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Chọn permission</label>
                        <div className={styles.dropdownWrapper}>
                            <Dropdown
                                items={permissions}
                                selected={form.permissions}
                                onChange={(next) => setForm((r) => ({ ...r, permissions: next }))}
                                getKey={getPermKey}
                                getLabel={getPermLabel}
                                placeholder="Chọn permission"
                                searchPlaceholder="Tìm permission..."
                                emptyText="Không tìm thấy permission"
                                countLabel={(c) => `Đã chọn ${c} permission`}
                                visibleItemCount={4}
                                itemHeight={2}
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Huỷ</button>
                        <button type="submit" className={styles.submitBtn} disabled={adding}>
                            {adding ? "Đang thêm..." : "Thêm role"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

