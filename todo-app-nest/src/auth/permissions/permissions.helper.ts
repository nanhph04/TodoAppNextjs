// src/auth/permissions/permissions.helper.ts
import { PERMISSIONS } from './permissions.constants';

export function hasPermission(userPermissions: string[], permission: string): boolean {
    return userPermissions.includes(permission) || userPermissions.includes(PERMISSIONS.SUPER_ADMIN);
}

export function hasAnyPermission(userPermissions: string[], actions: string[]): boolean {
    return actions.some((perm) => hasPermission(userPermissions, perm));
}

export function isSuperAdmin(userPermissions: string[]): boolean {
    return userPermissions.includes(PERMISSIONS.SUPER_ADMIN);
}

// Có thể mở rộng thêm các hàm check quyền khác nếu cần
