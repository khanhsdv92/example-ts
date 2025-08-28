import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const required = this.reflector.get<string[]>('roles', context.getHandler());
    if (!required) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return required.includes(user.role);
  }
}