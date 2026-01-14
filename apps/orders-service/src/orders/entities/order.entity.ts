import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number; 

  @Column({ default: 'PENDIENTE' })
  status: string;

  @Column('jsonb')
  items: any[];

  @CreateDateColumn()
  createdAt: Date;
}