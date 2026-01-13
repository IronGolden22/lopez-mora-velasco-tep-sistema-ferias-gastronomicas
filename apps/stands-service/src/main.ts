import { NestFactory } from '@nestjs/core';
import { StandsServiceModule } from './stands-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(StandsServiceModule);

  app.useGlobalPipes(new ValidationPipe()); 

  await app.listen(3001); 
}
bootstrap();