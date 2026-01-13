import * as dotenv from 'dotenv';
dotenv.config(); 

import { DataSource, DataSourceOptions } from 'typeorm';
// 👇 1. Importamos la clase User directamente (ajusta la ruta si te la marca en rojo)
import { User } from '../users/entities/user.entity'; 

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'users_db',
  
  // 👇 2. Ponemos la clase aquí directamente, sin rutas raras
  entities: [User], 
  
  synchronize: true, // Esto creará la tabla al guardar
  logging: true,     // 👇 3. Activamos logs para ver el SQL en la consola
};

export const AppDataSource = new DataSource(typeOrmConfig);