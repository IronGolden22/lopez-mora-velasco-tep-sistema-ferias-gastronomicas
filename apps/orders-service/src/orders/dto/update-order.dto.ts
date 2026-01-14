import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsString()
  @IsIn(['PENDIENTE', 'PREPARANDO', 'LISTO', 'ENTREGADO'])
  status?: string;
}