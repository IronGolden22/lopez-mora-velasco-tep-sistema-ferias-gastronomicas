import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 👇 RPC: Validar existencia y stock para Pedidos
  @MessagePattern('validate_product')
  async validateProduct(@Payload() data: { id: string; quantity: number }) {
    console.log(`🔎 (RPC) Verificando producto ID: ${data.id} | Cantidad solicitada: ${data.quantity}`);
    
    try {
      const product = await this.productsService.findOne(data.id);
      
      if (!product) {
        console.log(`Producto ${data.id} no existe`);
        return null;
      }

      // Verificamos si hay suficiente stock
      const hasStock = product.stock >= data.quantity;
      
      if (!hasStock) {
        console.log(`⚠️ Stock insuficiente para ${product.name}: Tiene ${product.stock}, pide ${data.quantity}`);
      } else {
        console.log(`✅ Stock confirmado para ${product.name}`);
      }

      // Retornamos el producto con la bandera de stock
      return { 
        ...product, 
        hasStock 
      }; 
    } catch (error) {
      console.error('💥 Error RPC en Productos:', error.message);
      return null;
    }
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { 
    return this.productsService.findOne(id); 
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}