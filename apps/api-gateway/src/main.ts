import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Agregamos '0.0.0.0' para forzar IPv4
  await app.listen(3000, '0.0.0.0'); 
  
  console.log('🚀 API Gateway LISTO en: http://127.0.0.1:3000');
}
bootstrap();