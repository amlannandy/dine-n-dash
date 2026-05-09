import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Dine & Dash API')
    .setDescription('Restaurant menu and ordering system API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
