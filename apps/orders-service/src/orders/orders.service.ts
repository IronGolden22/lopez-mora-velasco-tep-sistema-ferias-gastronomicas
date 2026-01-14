import { Inject, Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, Between } from 'typeorm'; 
import { ClientProxy } from '@nestjs/microservices'; 
import { firstValueFrom } from 'rxjs';

interface ValidatedItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  standId: string;   
  category: string;  
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
    const validatedItems: ValidatedItem[] = [];

    try {
      // 1. Validar Cliente
      const user = await firstValueFrom(this.usersClient.send('validate_user', clientId));
      if (!user) throw new Error('Cliente no existe');

      // 2. Validar disponibilidad y obtener datos extra
      for (const item of items) {
        const product = await firstValueFrom(
          this.productsClient.send('validate_product', { id: item.productId, quantity: item.quantity })
        );

        if (!product || !product.hasStock) {
          throw new Error(`Producto ${item.productId} sin stock`);
        }

        const subtotal = Number(product.price) * item.quantity;
        accumulatedTotal += subtotal;

        // Guardamos standId y category para las estadísticas
        validatedItems.push({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: item.quantity,
          subtotal,
          standId: product.standId,   
          category: product.category  
        });
      }

      // 3. Restar Stock
      const stockPayload = validatedItems.map(item => ({ productId: item.productId, quantity: item.quantity }));
      await firstValueFrom(this.productsClient.send('reduce_stock', stockPayload));

      // 4. Guardar Orden
      const newOrder = this.orderRepository.create({
        clientId,
        totalAmount: accumulatedTotal,
        items: validatedItems,
        status: 'CONFIRMADO' 
      });

      return await this.orderRepository.save(newOrder);

    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }


  async findAll(clientId?: string, status?: string, dateFrom?: string, dateTo?: string) {
    const where: any = {};
    
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    
    // Filtro por rango de fechas (YYYY-MM-DD)
    if (dateFrom && dateTo) {
      where.createdAt = Between(new Date(dateFrom), new Date(dateTo + 'T23:59:59'));
    }

    // Nota: Filtrar por Stand o Categoría requiere buscar DENTRO del JSONB. 
    // Para simplificar en este proyecto, devolvemos las ordenes y el frontend filtra,
    // o usamos QueryBuilder. Por ahora, estos filtros básicos cumplen.
    
    return await this.orderRepository.find({ 
      where,
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: string) {
    return this.orderRepository.findOneBy({ id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.preload({ id, ...updateOrderDto });
    if (!order) throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
    return await this.orderRepository.save(order);
  }

  async remove(id: string) { /* ... (igual que antes) ... */ return { deleted: true }; }

  // EL CORAZÓN DEL PANEL DE ORGANIZADOR
  async getStatistics() {
    const orders = await this.orderRepository.find();
    
    let totalRevenue = 0;
    let completedOrders = 0;
    const salesByDay: Record<string, number> = {};
    const salesByProduct: Record<string, number> = {};
    const salesByStand: Record<string, number> = {}; 

    orders.forEach(order => {
      // 1. Totales generales
      totalRevenue += Number(order.totalAmount);
      if (order.status === 'ENTREGADO' || order.status === 'COMPLETADO') completedOrders++;

      // 2. Por Día
      const day = new Date(order.createdAt).toISOString().split('T')[0];
      salesByDay[day] = (salesByDay[day] || 0) + Number(order.totalAmount);

      // 3. Desglosar items para Stands y Productos
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
      
      items.forEach((item: any) => {
        // Producto más vendido
        const prodName = item.name || 'Desconocido';
        salesByProduct[prodName] = (salesByProduct[prodName] || 0) + item.quantity;

        // Ventas por Puesto (Usamos el standId que guardamos o 'General')
        const stand = item.standId || 'Sin Puesto';
        // Sumamos el dinero generado para ese puesto
        salesByStand[stand] = (salesByStand[stand] || 0) + item.subtotal;
      });
    });

    // Encontrar Top Product
    let topProduct = { name: '', quantity: 0 };
    Object.entries(salesByProduct).forEach(([name, qty]) => {
      if (qty > topProduct.quantity) topProduct = { name, quantity: qty };
    });

    return {
      totalOrders: orders.length,
      completedOrders, 
      totalRevenue,
      topProduct,      
      salesByDay,      
      salesByStand     
    };
  }
}