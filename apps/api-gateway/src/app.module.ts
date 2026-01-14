import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      // 1. STANDS 
      {
        name: 'STANDS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },

      // 2. PRODUCTS 
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },

      // 3. ORDERS 
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },

      // 4. USERS 
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3005 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}