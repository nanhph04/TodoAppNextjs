import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }
        // Log user object và userId để debug
        console.log('[PermissionsGuard] user object:', user);
        const userId = user._id || user.id || user.userId || user.sub;
        console.log('[PermissionsGuard] userId truyền vào getUserPermissions:', userId);
        // Lấy danh sách quyền của user
        const userPermissions: string[] = await this.userService.getUserPermissions(userId);
        console.log('[PermissionsGuard] requiredPermissions:', requiredPermissions);
        console.log('[PermissionsGuard] userPermissions:', userPermissions);
        // Luôn gán userPermissions vào request để controller/service dùng được
        request.userPermissions = userPermissions;

        // Nếu không có requiredPermissions (route không yêu cầu permission cụ thể), vẫn cho qua
        if (!requiredPermissions) {
            return true;
        }

        // Nếu user có quyền super admin thì luôn cho phép
        if (userPermissions.includes('*:*')) {
            return true;
        }

        // Kiểm tra user có ÍT NHẤT MỘT quyền yêu cầu (logic "hoặc")
        const hasAnyPermission = requiredPermissions.some(p => userPermissions.includes(p));
        if (!hasAnyPermission) {
            throw new ForbiddenException(`Bạn cần ít nhất một trong các quyền: ${requiredPermissions.join(', ')}`);
        }

        return true;
    }
}
