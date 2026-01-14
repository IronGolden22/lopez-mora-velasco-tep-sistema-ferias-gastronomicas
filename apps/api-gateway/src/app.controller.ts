import { Controller, Get, Post, Body, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    // 1. Inyectamos ORDERS (Puerto 3003)
    @Inject('ORDERS_SERVICE') private clientOrders: ClientProxy,

    // 2. Inyectamos USERS (Puerto 3005)
    @Inject('USERS_SERVICE') private clientUsers: ClientProxy,

    // 3. Inyectamos STANDS (Puerto 3001)
    @Inject('STANDS_SERVICE') private clientStands: ClientProxy,

    // 4. Inyectamos PRODUCTS (Puerto 3002)
    @Inject('PRODUCTS_SERVICE') private clientProducts: ClientProxy,
  ) {}

  // ==========================================================
  // ZONA DE PEDIDOS (Orders) - http://localhost:3000/orders
  // ==========================================================
  @Post('orders')
  createOrder(@Body() data: any) {
    return this.clientOrders.send({ cmd: 'create_order' }, data);
  }

  @Get('orders')
  getOrders() {
    return this.clientOrders.send({ cmd: 'get_orders' }, {});
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.clientOrders.send({ cmd: 'find_order' }, id);
  }

  // ==========================================================
  // ZONA DE USUARIOS (Users) - http://localhost:3000/users
  // ==========================================================
  @Post('users')
  createUser(@Body() data: any) {
    return this.clientUsers.send({ cmd: 'create_user' }, data); // Ojo: Ellos deben tener este pattern
  }

  @Get('users')
  getUsers() {
    return this.clientUsers.send({ cmd: 'get_users' }, {});
  }

  // ==========================================================
  // ZONA DE PUESTOS (Stands) - http://localhost:3000/stands
  // ==========================================================
  @Post('stands')
  createStand(@Body() data: any) {
    return this.clientStands.send({ cmd: 'create_stand' }, data);
  }

  @Get('stands')
  getStands() {
    return this.clientStands.send({ cmd: 'get_stands' }, {});
  }

  // ==========================================================
  // ZONA DE PRODUCTOS (Products) - http://localhost:3000/products
  // ==========================================================
  @Post('products')
  createProduct(@Body() data: any) {
    return this.clientProducts.send({ cmd: 'create_product' }, data);
  }

  @Get('products')
  getProducts() {
    return this.clientProducts.send({ cmd: 'get_products' }, {});
  }
}