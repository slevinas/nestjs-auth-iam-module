import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from './iam/authentication/guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // This will enable the global validation pipe for the DTOs
  app.useGlobalPipes(new ValidationPipe());
  //Binding Interceptors
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  await app.listen(3535);
}
bootstrap();
