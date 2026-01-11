import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RpcService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async validateToken(token: string) {
    try {
      const result = await this.authService.validateToken(token);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async validateUser(userId: string) {
    try {
      const user = await this.usersService.validateUserById(userId);
      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getUserRole(userId: string) {
    try {
      const role = await this.usersService.getUserRole(userId);
      if (!role) {
        return { success: false, error: 'Usuario no encontrado' };
      }
      return { success: true, data: { role } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async validateRole(userId: string, requiredRole: string) {
    try {
      const isValid = await this.authService.validateUserRole(userId, requiredRole);
      return { success: true, data: { isValid } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
