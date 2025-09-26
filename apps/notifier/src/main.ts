/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  const config = app.get<any>(ConfigService);

  const port = config.get('PORT');

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
