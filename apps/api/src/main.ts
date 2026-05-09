import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { setupSwagger } from '@/config/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup global prefix
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      process.env.PARTNER_URL ?? 'http://localhost:5173',
      process.env.CLIENT_URL ?? 'http://localhost:5174',
      process.env.ADMIN_URL ?? 'http://localhost:5175',
    ],
    credentials: true,
  });

  // Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger API docs
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
