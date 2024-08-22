import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import jwtConfig from '../../config/jwt.config';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenDto } from '../authentication/dto/refresh-token.dto';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from '../authentication/dto/sign-up.dto';
import { RefreshTokenIdsStorage } from './entities/refreshTokenIdsStorage.entity';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshTokenIdsStorage)
    private readonly refreshTokenIdsStorageRepository: Repository<RefreshTokenIdsStorage>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
   
    try {
      const user = new User(signUpDto);

      user.password = await this.hashingService.hash(signUpDto.password);
      const responseFromUserRepositorySave = await this.usersRepository.save(
        user,
      );
      
    
      return responseFromUserRepositorySave;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
  
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    if (user.isTfaEnabled) {
      const isValid = this.otpAuthService.verifyCode(
        signInDto.tfaCode,
        user.tfaSecret,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }
    const accessTokenAndRefreshToken = await this.generateTokens(user);
    return accessTokenAndRefreshToken;
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role as any },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    this.insertRefreshTokenId(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      const isValid = await this.validateRefreshToken(sub, refreshTokenId);
      if (isValid) {
        await this.invalidateRefreshToken(user.id);
      } else {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
  async insertRefreshTokenId(userId, refreshTokenId) {
    const refreshTokenIdsStorageE = new RefreshTokenIdsStorage();
    refreshTokenIdsStorageE.id = userId;
    refreshTokenIdsStorageE.refreshTokenId = refreshTokenId;
    await this.refreshTokenIdsStorageRepository.save(refreshTokenIdsStorageE);
  }
  async validateRefreshToken(userId, refreshTokenId) {
    const refreshTokenIdFromDb =
      await this.refreshTokenIdsStorageRepository.findOneByOrFail({
        id: userId,
      });
    if (!refreshTokenIdFromDb) {
      return false;
    } else if (refreshTokenIdFromDb.refreshTokenId !== refreshTokenId) {
      return false;
    }

    return true;
  }
  async invalidateRefreshToken(userId) {
    await this.refreshTokenIdsStorageRepository.delete({
      id: userId,
    });
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
