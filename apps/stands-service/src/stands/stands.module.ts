import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StandsService } from './stands.service';
import { StandsController } from './stands.controller';
import { Stand } from './entities/stand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stand]),
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: configService.get<number>('RPC_PORT') || 3004,
          },
        }),
      },
    ]),
  ],
  controllers: [StandsController],
  providers: [StandsService],
})
export class StandsModule {}