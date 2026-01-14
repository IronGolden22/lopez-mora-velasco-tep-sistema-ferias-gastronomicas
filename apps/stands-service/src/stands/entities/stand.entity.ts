import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stands') // <--- Esto le dice a Postgres: "Crea una tabla llamada 'stands'"
export class Stand {
  @PrimaryGeneratedColumn('uuid') // Crea una columna ID autogenerada
  id: string;

  @Column('text') // Crea una columna de texto
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  location: string;
}