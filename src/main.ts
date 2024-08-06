import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import jwtConfig from './config/jwt.config';
import { AccessTokenGuard } from './iam/authentication/guards/access-token.guard';

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
