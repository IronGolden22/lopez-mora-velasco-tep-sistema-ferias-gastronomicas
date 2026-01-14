import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
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
    
    const productId = createOrderDto['productId'] || 'f5f1ac24-c319-4fc8-be11-66e05b02fdaf'; 

    this.logger.log(`Validando producto ${productId} antes de crear orden...`);

    const product = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_product' }, { id: productId })
    );

    if (!product) {
      this.logger.error('❌ Producto no encontrado. Cancelando orden.');
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND); 
    }

    if (product.stock <= 0) {
        this.logger.error('❌ Sin stock. Cancelando orden.');
        throw new HttpException('Producto agotado', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`✅ Producto válido: ${product.name}. Precio: ${product.price}`);


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