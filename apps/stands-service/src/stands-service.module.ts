import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsModule } from './stands/stands.module'; 

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pepito2', 
      database: 'stands_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    StandsModule, 
  ],
  controllers: [], 
  providers: [],  
})
export class StandsServiceModule {} 