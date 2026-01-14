import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersServiceModule } from './users-service.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(UsersServiceModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());


  const rpcPort = process.env.RPC_PORT || '3004';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(rpcPort, 10),
    },
  });

  await app.startAllMicroservices();
  console.log(`RPC de Usuarios listo en puerto ${rpcPort}`);

  // 2. Escuchar peticiones HTTP después
  const port = process.env.PORT || '3005';
  await app.listen(parseInt(port, 10));
  console.log(`HTTP Usuarios listo en puerto ${port}`);
}

bootstrap();