import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorResponseDto } from '@shared/models/error-response-dto';
import { AppModule } from '@src/app.module';

/**
 * This is the application bootstrap run pipeline
 */
async function bootstrap() {
  // Getting environment variables
  const {
    APP_NAME,
    APP_DESCRIPTION,
    APP_VERSION,
    PORT,
    SWAGGER_ENDPOINT
  } = process.env;

  // Creating a nest app
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(APP_VERSION);

  // Adding swagger options
  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .setTitle(APP_NAME)
    .addTag('Auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  // Configuring Swagger
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_ENDPOINT, app, doc, {
    customSiteTitle: APP_NAME,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

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
  await app.listen(PORT);
}
bootstrap();
