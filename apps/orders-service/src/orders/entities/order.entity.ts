import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  total: number;

  @Column({ default: 'PENDIENTE' })
  status: string;


}