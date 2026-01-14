import { IsString, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive() // El precio debe ser positivo
  price: number;

  @IsNumber()
  @Min(0) // El stock no puede ser negativo
  stock: number;
}