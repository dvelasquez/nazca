import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger UI at /api
  SwaggerModule.setup('api', app, document);
  // Write OpenAPI JSON to file
  writeFileSync('../openapi/openapi.json', JSON.stringify(document, null, 2));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
