import { NestFactory } from '@nestjs/core';
import { ProductsServiceModule } from './products-service.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProductsServiceModule);

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  const httpPort = process.env.PRODUCTS_PORT || 3002;
  const rpcPort = process.env.PRODUCTS_RPC_PORT || 3006;

  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: Number(rpcPort),
    },
  });

  
  await app.startAllMicroservices();
  await app.listen(httpPort);
  
  console.log(`Products Service corriendo en:`);
  console.log(`   - HTTP: http://localhost:${httpPort}`);
  console.log(`   - RPC:  localhost:${rpcPort}`);
}
bootstrap();