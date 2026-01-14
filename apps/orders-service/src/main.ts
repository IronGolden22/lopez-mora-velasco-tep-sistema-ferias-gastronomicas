import { NestFactory } from '@nestjs/core';
// CAMBIO IMPORTANTE: Usamos el nombre real de tu archivo de módulo 👇
import { OrdersServiceModule } from './orders-service.module'; 
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // CAMBIO IMPORTANTE: Creamos la app usando tu módulo real 👇
  const app = await NestFactory.create(OrdersServiceModule);

  app.useGlobalPipes(new ValidationPipe());

  // 1. CONFIGURACIÓN TCP (Para que el Gateway lo encuentre en el 3003)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3003, // Puerto interno TCP
    },
  });

  // 2. Iniciar los microservicios
  await app.startAllMicroservices();

  // 3. CONFIGURACIÓN HTTP (Para Postman directo en el 3006)
  await app.listen(3006); 
  console.log(`Orders Service corriendo. TCP: 3003 (Gateway) | HTTP: 3006 (Postman)`);
}
bootstrap();