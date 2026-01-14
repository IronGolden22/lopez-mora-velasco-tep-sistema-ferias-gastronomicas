import * as dotenv from 'dotenv';
dotenv.config(); 

import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity'; 

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'users_db',
  

  entities: [User], 
  
  synchronize: true, 
  logging: true,   
};

export const AppDataSource = new DataSource(typeOrmConfig);