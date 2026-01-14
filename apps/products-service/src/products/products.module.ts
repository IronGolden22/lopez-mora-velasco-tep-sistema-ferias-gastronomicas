import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- 1. Importar TypeOrmModule
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // <--- 2. Importar tu Entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), 
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}