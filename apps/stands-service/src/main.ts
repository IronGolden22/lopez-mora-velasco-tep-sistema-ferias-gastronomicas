import { NestFactory } from '@nestjs/core';
import { StandsServiceModule } from './stands-service.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(StandsServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  
  const httpPort = process.env.STANDS_PORT || 3001;
  const rpcPort = process.env.STANDS_RPC_PORT || 3008;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: Number(rpcPort),
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);
  
  console.log(`Stands Service corriendo en:`);
  console.log(`   - HTTP: http://localhost:${httpPort}`);
  console.log(`   - RPC:  localhost:${rpcPort}`);
}
bootstrap();