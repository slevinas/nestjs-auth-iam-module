import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from './iam/authentication/guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // This will enable the global validation pipe for the DTOs
  app.useGlobalPipes(new ValidationPipe());
  //
  await app.listen(3535);
}
bootstrap();
