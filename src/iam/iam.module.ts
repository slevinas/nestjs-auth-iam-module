import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ApiKey } from '../users/api-keys/entities/api-key.entity/api-key.entity';
import { User } from '../users/entities/user.entity';
import { ApiKeysService } from './authentication/api-keys.service';
import { RefreshTokenDto } from './authentication/dto/refresh-token.dto';
import { RefreshTokenIdsStorage } from './authentication/entities/refreshTokenIdsStorage.entity';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { ApiKeyGuard } from './authentication/guards/api-key/api-key.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { Roles } from './authorization/decorators/roles.decorator';
import { RolesGuard } from './authorization/guards/roles/roles.guard';

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
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
