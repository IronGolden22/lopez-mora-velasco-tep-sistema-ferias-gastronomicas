import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module'; 
import { OrdersServiceController } from './orders-service.controller';
import { OrdersServiceService } from './orders-service.service';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pepito2', 
      database: 'orders_db',
      autoLoadEntities: true,
      synchronize: true, 
    }),

    OrdersModule, 
  ],
  controllers: [OrdersServiceController],
  providers: [OrdersServiceService],
})
export class OrdersServiceModule {}