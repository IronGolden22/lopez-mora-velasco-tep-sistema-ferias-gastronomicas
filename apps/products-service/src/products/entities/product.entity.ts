import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() 
export class Product {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text', { default: 'General' })
  category: string;

  @Column('float') 
  price: number;

  @Column('int')
  stock: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column()
  standId: string;
}