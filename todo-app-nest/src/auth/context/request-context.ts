import { UnauthorizedException } from '@nestjs/common';

export interface UserContext {
    userId?: string;
    permissions: string[];
}

export function getUserContext(req: any): UserContext {
    const idRaw = req?.user?.userId ?? req?.user?.sub ?? req?.user?.id ?? req?.user?._id;
    const userId = typeof idRaw === 'string' ? idRaw : idRaw?.toString?.();
    const permissions = Array.isArray(req?.userPermissions) ? req.userPermissions : [];
    return { userId, permissions };
}

export function requireUserId(req: any): { userId: string; permissions: string[] } {
    const ctx = getUserContext(req);
    if (!ctx.userId) {
        throw new UnauthorizedException('Missing user id');
    }
    return { userId: ctx.userId, permissions: ctx.permissions };
}
