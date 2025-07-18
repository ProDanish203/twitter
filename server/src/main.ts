import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 8000;

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());

  const origin = config.get<string>('CORS_ORIGIN') || '*';
  const allowedOrigins = origin
    ? origin.split(',').map((url) => url.trim())
    : '*';

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: '*',
    maxAge: 3600,
  });

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Twitter Clone API')
    .setDescription('API documentation for the Twitter clone application')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('APIs')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
}
bootstrap();
