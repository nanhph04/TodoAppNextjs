import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesService } from "src/roles/roles.service";
import { ROLES_KEY } from "../decorator/role.decorator";



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private roleService: RolesService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const userRoles: string[] = user?.roles || [];

        // Nếu user có role 'admin' thì bỏ qua kiểm tra
        if (userRoles.includes('admin')) {
            return true;
        }
        // Kiểm tra xem user có ít nhất một trong các role cần thiết không
        const hasRole = requiredRoles.some(role => userRoles.includes(role));
        return hasRole;
    }
} 