import { NestFactory } from '@nestjs/core';

import 'dotenv/config';

import { AppModule } from './app.module';

import { SeedService } from './seed/seed.service';



async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const seed = app.get(SeedService);
    await seed.run();
  } finally {
    await app.close();
  }
}

bootstrap();
