import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //RPC: Validar existencia y stock (SOLO LECTURA)
  @MessagePattern('validate_product')
  async validateProduct(@Payload() data: { id: string; quantity: number }) {
    console.log(`(RPC) Verificando producto ID: ${data.id} | Pide: ${data.quantity}`);
    
    try {
      const product = await this.productsService.findOne(data.id);
      
      if (!product) return null;

      const hasStock = product.stock >= data.quantity;
      
      return { 
        ...product, 
        hasStock 
      }; 
    } catch (error) {
      console.error('Error RPC validate:', error.message);
      return null;
    }
  }

  // 👇 NUEVO RPC: Ejecutar la resta de stock (ESCRITURA)
  @MessagePattern('reduce_stock')
  async reduceStock(@Payload() items: { productId: string; quantity: number }[]) {
    console.log('(RPC) Solicitud de reducción de stock recibida');
    try {
      return await this.productsService.reduceStock(items);
    } catch (error) {
      console.error('Error reduciendo stock:', error.message);
      // Devolvemos un error claro para que Pedidos aborte la creación
      throw new Error(error.message);
    }
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() { return this.productsService.findAll(); }

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