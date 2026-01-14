import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stands')
export class Stand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  location: string;

  @Column('text')
  ownerId: string;

  @Column('text', { default: 'PENDIENTE' })
  status: string;
}