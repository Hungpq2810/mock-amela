import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  ClassSerializerInterceptor,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './utils/http.exception-filter';
import { SwaggerModule } from '@nestjs/swagger';
import openAPIConfig from './configs/open-api.config';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  //App Filter
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException({
          message: 'Unprocessable Entity',
          errors: errors
            .map((error) => Object.values(error.constraints || error))
            .flat(),
        }),
    }),
  );

  //Exception Filter
  //Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // OpenAPI-Swagger
  if (process.env.APP_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, openAPIConfig);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    logger.log(`Listening on port ${port}`);
  });
}
bootstrap();
