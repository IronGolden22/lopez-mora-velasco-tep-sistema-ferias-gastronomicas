import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  total: number;

  @IsOptional()
  status?: string;
}