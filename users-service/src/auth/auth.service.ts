import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isValid: true,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async validateUserRole(userId: string, requiredRole: string): Promise<boolean> {
    const user = await this.usersService.validateUserById(userId);
    if (!user) {
      return false;
    }
    return user.role === requiredRole;
  }
}
