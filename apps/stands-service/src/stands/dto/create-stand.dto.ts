import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class CreateStandDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}