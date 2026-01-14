import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; 
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // 1. (Simulación) 
    const productId = 1; 

    this.logger.log(`Intentando conectar con Productos para validar ID: ${productId}...`);

    try {
      const productData = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_product' }, { id: productId })
      );

      this.logger.log('Producto validado por RPC:', productData);
      
      // Aqui va la logica de: Si no hay stock, lanzar error.

    } catch (error) {
      this.logger.error('Error contactando a Productos:', error);
      // Por ahora no bloqueamos el pedido si falla, solo logueamos el error
    }

    
    const newOrder = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: string) {
    return await this.orderRepository.findOneBy({ id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    return await this.orderRepository.findOneBy({ id });
  }

  async remove(id: string) {
    await this.orderRepository.delete(id);
    return { deleted: true, id };
  }
}