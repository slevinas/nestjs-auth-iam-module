import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as session from 'express-session';
import * as passport from 'passport';
import jwtConfig from 'src/config/jwt.config';
import { ApiKey } from '../users/api-keys/entities/api-key.entity/api-key.entity';
import { User } from '../users/entities/user.entity';
import { ApiKeysService } from './authentication/api-keys.service';
import { RefreshTokenDto } from './authentication/dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './authentication/entities/refreshTokenIdsStorage.entity';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { Roles } from './authorization/decorators/roles.decorator';
import { RolesGuard } from './authorization/guards/roles/roles.guard';
import { UserSerializer } from './authentication/serializers/user-serializer/user-serializer';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshTokenIdsStorage, ApiKey]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService, // 👈
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    AccessTokenGuard,
    ApiKeyGuard,
    AuthenticationService,
    ApiKeysService,
    GoogleAuthenticationService,
    OtpAuthenticationService,
    SessionAuthenticationService,
    UserSerializer,
  ],
  controllers: [
    AuthenticationController,
    GoogleAuthenticationController,
    SessionAuthenticationController,
  ],
})
export class IamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: false,
          cookie: {
            sameSite: true,
            httpOnly: true,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
