import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 Importar Config
import { StandsModule } from './stands/stands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('STANDS_DB_HOST'),
        port: configService.get<number>('STANDS_DB_PORT'),
        username: configService.get<string>('STANDS_DB_USERNAME'),
        password: configService.get<string>('STANDS_DB_PASSWORD'),
        database: configService.get<string>('STANDS_DB_DATABASE'), 
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    
    StandsModule, 
  ],
  controllers: [], 
  providers: [],  
})
export class StandsServiceModule {}