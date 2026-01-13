import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersServiceService {
  getHealth() {
    return {
      status: 'ok',
      service: 'usuarios',
      timestamp: new Date().toISOString(),
    };
  }
}
