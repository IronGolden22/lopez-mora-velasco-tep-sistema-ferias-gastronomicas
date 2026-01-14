import { Controller, Get, Post, Body, Headers, HttpException, Param, Patch, Delete, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  // ==========================================
  //  1. AUTH & USERS (Puerto 3005)
  // ==========================================

  @Post('auth/login')
  async login(@Body() body: any) {
    try {
      
      const response: any = await firstValueFrom(this.httpService.post('http://127.0.0.1:3005/auth/login', body));
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data || 'Error Login', e.response?.status || 500); }
  }

  @Post('auth/validate')
  async validateToken(@Body() body: any) {
    try {
      const response: any = await firstValueFrom(this.httpService.post('http://127.0.0.1:3005/auth/validate', body));
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Post('users/register') 
  async register(@Body() body: any) {
    try {
      const response: any = await firstValueFrom(this.httpService.post('http://127.0.0.1:3005/users/register', body));
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data || 'Error Registro', e.response?.status || 500); }
  }

  @Get('users')
  async getUsers(@Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3005/users', { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get(`http://127.0.0.1:3005/users/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.patch(`http://127.0.0.1:3005/users/${id}`, body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.delete(`http://127.0.0.1:3005/users/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }


  // ==========================================
  //  2. STANDS / PUESTOS (Puerto 3001)
  // ==========================================

  @Post('stands')
  async createStand(@Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3001/stands', body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

// 5. LISTAR PUESTOS
  @Get('stands')
  async getStands(@Query() query: any) { 
    try {
      const response: any = await firstValueFrom(
        
        this.httpService.get('http://127.0.0.1:3001/stands', { params: query })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Get('stands/:id')
  async getStandById(@Param('id') id: string) {
    try {
      const response: any = await firstValueFrom(this.httpService.get(`http://127.0.0.1:3001/stands/${id}`));
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Patch('stands/:id')
  async updateStand(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.patch(`http://127.0.0.1:3001/stands/${id}`, body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Patch('stands/:id/approve')
  async approveStand(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.patch(`http://127.0.0.1:3001/stands/${id}/approve`, {}, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Delete('stands/:id')
  async deleteStand(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.delete(`http://127.0.0.1:3001/stands/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }


  // ==========================================
  //  3. PRODUCTS / PRODUCTOS (Puerto 3002)
  // ==========================================

  @Post('products')
  async createProduct(@Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3002/products', body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

@Get('products')
  async getProducts(@Query() query: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3002/products', { params: query }) 
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    try {
      const response: any = await firstValueFrom(this.httpService.get(`http://127.0.0.1:3002/products/${id}`));
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Patch('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.patch(`http://127.0.0.1:3002/products/${id}`, body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.delete(`http://127.0.0.1:3002/products/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }


  // ==========================================
  //  4. ORDERS / PEDIDOS (Puerto 3003)
  // ==========================================



  @Post('orders')
  async createOrder(@Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3003/orders', body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

@Get('orders')
  async getOrders(@Headers() headers: any, @Query() query: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3003/orders', { 
           headers: { Authorization: headers['authorization'] },
           params: query // 2. Agregamos esto para pasar los filtros (clientId, status)
        })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

 @Get('orders/stats/dashboard')
  async getOrderStats(@Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3003/orders/stats/dashboard', { 
           headers: { Authorization: headers['authorization'] } 
        })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Get('orders/:id')
  async getOrderById(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.get(`http://127.0.0.1:3003/orders/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Patch('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.patch(`http://127.0.0.1:3003/orders/${id}`, body, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }

  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string, @Headers() headers: any) {
    try {
      const response: any = await firstValueFrom(
        this.httpService.delete(`http://127.0.0.1:3003/orders/${id}`, { headers: { Authorization: headers['authorization'] } })
      );
      return response.data;
    } catch (e) { throw new HttpException(e.response?.data, e.response?.status || 500); }
  }
}