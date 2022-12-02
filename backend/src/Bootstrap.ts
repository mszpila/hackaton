import { NestFactory } from '@nestjs/core';
import { MainModule } from './MainModule';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    cors: true,
    logger: ['error', 'warn', 'log'],
  });
  app.enableCors();
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
