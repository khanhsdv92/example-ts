import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
     logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:5173'], // FE chạy ở Vite port 5173
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn dùng cookie/JWT trong header
  });
 
  await app.listen(3000);
  Logger.log('Listening on http://localhost:3000');
}
bootstrap();