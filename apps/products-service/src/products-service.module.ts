import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 Importamos Config
import { ProductsServiceController } from './products-service.controller';
import { ProductsServiceService } from './products-service.service';
import { ProductsModule } from './products/products.module';

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
        host: configService.get<string>('PRODUCTS_DB_HOST'),
        port: configService.get<number>('PRODUCTS_DB_PORT'),
        username: configService.get<string>('PRODUCTS_DB_USERNAME'),
        password: configService.get<string>('PRODUCTS_DB_PASSWORD'),
        database: configService.get<string>('PRODUCTS_DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    ProductsModule,
  ],
  controllers: [ProductsServiceController],
  providers: [ProductsServiceService],
})
export class ProductsServiceModule {}