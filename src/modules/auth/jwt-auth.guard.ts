import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLES } from 'src/constans/role.constant';
import { ROLES_KEY } from 'src/decorator/role.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Kiểm tra vai trò của route hiện tại
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
      return (super.canActivate(context) as Promise<boolean>) || true;
    }

    const canActivate = await super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userRole = user.role;
    let hasRole = false;

    if (roles.includes(ROLES.ADMIN)) {
      hasRole = userRole === ROLES.ADMIN;
    } else if (roles.includes(ROLES.EMPLOYEE)) {
      hasRole = userRole === ROLES.ADMIN || userRole === ROLES.EMPLOYEE;
    }

    if (!hasRole) {
      throw new UnauthorizedException(
        'Bạn không có quyền truy cập vào API này',
      );
    }

    return true;
  }
}
