import { Controller, Get, Post, Body, Headers, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  // ==========================================
  //  AUTENTICACIÓN Y USUARIOS (Puerto 3005)
  // ==========================================

  // 1. REGISTRO (Público)
  // Apunta a: http://127.0.0.1:3005/users/register
  @Post('auth/register') 
  async register(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3005/users/register', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error al registrar', error.response?.status || 500);
    }
  }

  // 2. LOGIN (Público)
  // Apunta a: http://127.0.0.1:3005/auth/login
  @Post('auth/login')
  async login(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3005/auth/login', body)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Credenciales inválidas', error.response?.status || 500);
    }
  }

  // 3. LISTAR USUARIOS (Protegido)
  // Apunta a: http://127.0.0.1:3005/users
  @Get('users')
  async getUsers(@Headers() headers: any) {
    try {
      
      const authHeader = headers['authorization'];
      
      const response = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3005/users', {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Acceso denegado', error.response?.status || 500);
    }
  }

  // ==========================================
  //   PRODUCTOS (Puerto 3002)
  // ==========================================
  @Get('products')
  async getProducts() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://127.0.0.1:3002/products')
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data, error.response?.status || 500);
    }
  }

  // ==========================================
  //   PEDIDOS (Puerto 3003)
  // ==========================================
  @Post('orders')
  async createOrder(@Body() body: any, @Headers() headers: any) {
    try {
      const authHeader = headers['authorization'];
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:3003/orders', body, {
           headers: { Authorization: authHeader } 
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data, error.response?.status || 500);
    }
  }
}