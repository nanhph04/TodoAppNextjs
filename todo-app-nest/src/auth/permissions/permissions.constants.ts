// src/auth/permissions/permissions.constants.ts
export const PERMISSIONS = {
    SUPER_ADMIN: '*:*',
    TASK_CREATE_ANY: 'task:create:any',
    TASK_CREATE_OWN: 'task:create:own',
    TASK_READ_ANY: 'task:read:any',
    TASK_READ_OWN: 'task:read:own',
    TASK_UPDATE_ANY: 'task:update:any',
    TASK_UPDATE_OWN: 'task:update:own',
    TASK_DELETE_ANY: 'task:delete:any',
    TASK_DELETE_OWN: 'task:delete:own',
    // Thêm các quyền khác nếu cần
};
