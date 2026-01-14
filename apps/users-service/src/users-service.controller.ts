import { Controller, Get } from '@nestjs/common';
import { UsersServiceService } from './users-service.service';

@Controller()
export class UsersServiceController {
  constructor(private readonly usersService: UsersServiceService) {}

  @Get('health')
  getHealth() {
    return this.usersService.getHealth();
  }
}
