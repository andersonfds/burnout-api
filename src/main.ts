import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { ErrorResponseDto } from '@shared/models/error-response-dto';

/**
 * This is the application bootstrap run pipeline
 */
async function bootstrap() {
  // Getting environment variables
  const {
    APP_NAME,
    APP_DESCRIPTION,
    APP_VERSION,
    APP_SERVE,
    SWAGGER_ENDPOINT
  } = process.env;

  // Creating a nest app
  const app = await NestFactory.create(AppModule);

  // Adding swagger options
  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .setTitle(APP_NAME)
    .addBearerAuth({ type: 'http', in: 'header' }, 'token')
    .build();

  // Configuring Swagger
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_ENDPOINT, app, doc);

  // Custom exception handling
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    dismissDefaultMessages: true,
    exceptionFactory: (errors) =>
      new BadRequestException(
        new ErrorResponseDto(errors, 400)),
  }));

  // Starting the app
  await app.listen(APP_SERVE);
}
bootstrap();
