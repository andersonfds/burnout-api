import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import * as dotnev from 'dotenv';

/**
 * This is the application bootstrap run pipeline
 */
async function bootstrap() {
  // Enabling environment variables
  dotnev.config();

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
    .addBearerAuth()
    .build();

  // Configuring Swagger
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_ENDPOINT, app, doc);

  // Starting the app
  await app.listen(APP_SERVE);
}
bootstrap();
