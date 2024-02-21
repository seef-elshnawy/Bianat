import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';

//const cookieSession = require('cookie-session');
require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(graphqlUploadExpress({ maxFileSize: 500000, maxFiles: 6 }));
  await app.listen(8000);
}
bootstrap();
