import { NestFactory } from '@nestjs/core';
import { OrdersServiceModule } from './orders-service.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  const httpPort = process.env.ORDERS_PORT || 3003;
  const rpcPort = process.env.ORDERS_RPC_PORT || 3007;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: Number(rpcPort),
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  console.log(`Orders Service corriendo en:`);
  console.log(`   - HTTP: http://localhost:${httpPort}`);
  console.log(`   - RPC:  localhost:${rpcPort}`);
}
bootstrap();
