import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { OrdersServiceController } from './orders-service.controller';
import { OrdersServiceService } from './orders-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),


    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('ORDERS_DB_HOST'),
        port: configService.get<number>('ORDERS_DB_PORT'),
        username: configService.get<string>('ORDERS_DB_USERNAME'),
        password: configService.get<string>('ORDERS_DB_PASSWORD'),
        database: configService.get<string>('ORDERS_DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    OrdersModule,
  ],
  controllers: [OrdersServiceController],
  providers: [OrdersServiceService],
})
export class OrdersServiceModule {}