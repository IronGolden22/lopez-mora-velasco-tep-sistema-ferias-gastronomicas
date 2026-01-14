import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; 
import { firstValueFrom } from 'rxjs';

// 👇 Definimos la estructura de lo que guardaremos en el arreglo
interface ValidatedItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { clientId, items } = createOrderDto;
    let accumulatedTotal = 0;
    
    // 👇 CAMBIO CLAVE: Le decimos que es un arreglo de ValidatedItem
    const validatedItems: ValidatedItem[] = [];

    try {
      // 1. Validar Cliente
      const user = await firstValueFrom(this.usersClient.send('validate_user', clientId));
      if (!user) throw new Error('Cliente no existe');

      // 2. Validar cada Producto y Stock
      for (const item of items) {
        const product = await firstValueFrom(
          this.productsClient.send('validate_product', { id: item.productId, quantity: item.quantity })
        );

        if (!product || !product.hasStock) {
          throw new Error(`Producto ${item.productId} sin stock o no encontrado`);
        }

        const subtotal = Number(product.price) * item.quantity;
        accumulatedTotal += subtotal;

        // Ahora el .push() funcionará perfectamente sin errores de tipo
        validatedItems.push({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: item.quantity,
          subtotal
        });
      }

      // 3. Guardar la orden
      const newOrder = this.orderRepository.create({
        clientId,
        totalAmount: accumulatedTotal,
        items: validatedItems,
        status: 'PENDIENTE'
      });

      return await this.orderRepository.save(newOrder);

    } catch (err) {
      this.logger.error(`❌ Error en pedido: ${err.message}`);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({
      id: id,
      ...updateOrderDto as any,
    });
    
    if (!order) throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
    return await this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { deleted: true, id };
  }
}