import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// 1. IMPORTANTE: Agregar estos imports
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ======================================================
  //  PARTE 1: MÉTODOS PARA EL API GATEWAY (TCP / Microservicio)
  // ======================================================
  
  @MessagePattern({ cmd: 'create_order' })
  createMicroservice(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'get_orders' })
  findAllMicroservice() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'find_order' })
  findOneMicroservice(@Payload() id: string) {
    return this.ordersService.findOne(id);
  }

  // ======================================================
  //  PARTE 2: MÉTODOS HTTP (Postman Directo al puerto 3006)
  // ======================================================

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}