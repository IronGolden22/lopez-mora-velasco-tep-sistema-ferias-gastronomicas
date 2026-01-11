import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class SelfOrOrganizadorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = req.params.id;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.role === Role.ORGANIZADOR || user.id === id) {
      return true;
    }

    throw new ForbiddenException('No tienes permiso para acceder a este recurso');
  }
}
