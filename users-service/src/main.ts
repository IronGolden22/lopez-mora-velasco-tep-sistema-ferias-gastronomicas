import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || '3001';
  await app.listen(parseInt(port, 10));
  console.log(`Servicio corriendo en puerto ${port}`);

  const rpcPort = process.env.RPC_PORT || '3002';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(rpcPort, 10),
    },
  });

  await app.startAllMicroservices();
  console.log(`RPC en puerto ${rpcPort}`);
}

bootstrap();
