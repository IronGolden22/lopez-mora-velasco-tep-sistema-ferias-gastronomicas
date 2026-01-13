import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService { 
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
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