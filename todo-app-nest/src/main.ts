import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // enable class-transformer on DTOs
  }));
  const config = new DocumentBuilder()
    .setTitle('Work Management API') // Tên dự án của bạn
    .setDescription('API documentation for Work Management App')
    .setVersion('1.0')
    .addBearerAuth() // Nếu có dùng JWT Login
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documents', app, document, {
    useGlobalPrefix: true,
  });
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
