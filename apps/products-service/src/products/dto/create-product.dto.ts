import { IsString, IsNumber, IsPositive, Min, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive() 
  price: number;

  @IsNumber()
  @Min(0) 
  stock: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  standId: string;
}