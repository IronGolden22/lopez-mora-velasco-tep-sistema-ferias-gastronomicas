import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() 
export class Product {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float') // Para decimales (precio)
  price: number;

  @Column('int')
  stock: number;

  @Column('boolean', { default: true })
  isActive: boolean;
}