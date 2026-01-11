import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcService } from './rpc.service';

@Controller()
export class RpcController {
  constructor(private readonly rpcService: RpcService) {}

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() data: { token: string }) {
    return await this.rpcService.validateToken(data.token);
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(@Payload() data: { userId: string }) {
    return await this.rpcService.validateUser(data.userId);
  }

  @MessagePattern({ cmd: 'get_user_role' })
  async getUserRole(@Payload() data: { userId: string }) {
    return await this.rpcService.getUserRole(data.userId);
  }

  @MessagePattern({ cmd: 'validate_role' })
  async validateRole(@Payload() data: { userId: string; requiredRole: string }) {
    return await this.rpcService.validateRole(data.userId, data.requiredRole);
  }
}
