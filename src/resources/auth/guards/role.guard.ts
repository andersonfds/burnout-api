import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@src/resources/user/enum/user-role.enum';
import { isNotEmpty } from 'class-validator';
import { Observable } from 'rxjs';
import { getCurrentUser } from '../decorators/current-user';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    const user = getCurrentUser(context);
    const userRole = roles.find(x => x == user.role || user.role == UserRole.ADMIN);

    return isNotEmpty(userRole);
  }
}
