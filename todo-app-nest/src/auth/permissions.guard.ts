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
   
        const userId = user._id || user.id || user.userId || user.sub;
        const userPermissions: string[] = await this.userService.getUserPermissions(userId);
        request.userPermissions = userPermissions;
        if (!requiredPermissions) {
            return true;
        }

        if (userPermissions.includes('*:*')) {
            return true;
        }

        const hasAnyPermission = requiredPermissions.some(p => userPermissions.includes(p));
        if (!hasAnyPermission) {
            throw new ForbiddenException(`Bạn cần ít nhất một trong các quyền: ${requiredPermissions.join(', ')}`);
        }

        return true;
    }
}
