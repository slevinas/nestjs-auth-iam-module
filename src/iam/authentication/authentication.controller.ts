import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity/api-key.entity';
import { Repository } from 'typeorm';

import { Request } from 'express';
import { access } from 'fs';
import { toFileStream } from 'qrcode';
import { User } from 'src/users/entities/user.entity';
import { ActiveUser } from '../decorators/active-user.decorator';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { ApiKeysService } from './api-keys.service';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { OtpAuthenticationService } from './otp-authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    @InjectDataSource() private readonly dataSource: any,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly apiKeysService: ApiKeysService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @Auth(AuthType.None)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    
    const responsFromAuthServiceSignup = await this.authService.signUp(
      signUpDto,
    );

    if (responsFromAuthServiceSignup) {
     
    }

    return 'responsFromAuthServiceSignup';
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessTokenAndRefreshToken = await this.authService.signIn(signInDto);
    if (accessTokenAndRefreshToken) {
     
      const testingResponseObject = {
        ...accessTokenAndRefreshToken,
        email: signInDto.email,
      };
     
      return { ...accessTokenAndRefreshToken, email: signInDto.email };
    }

    //  // For Setting the cookie on the response object which will be sent to the client (browser)
    //   response.cookie('accessToken', accessToken, {
    //     secure: true,
    //     httpOnly: true,
    //     sameSite: true,
    //   });
  }

  @Get('create-api-key')
  async createApiKey() {
    const apiKeyAndHash = await this.apiKeysService.createAndHash(5);


    return await this.apiKeyRepository.save({
      key: apiKeyAndHash.hashedKey,
      uuid: randomUUID(),
      user: { id: 8 },
    });
  } // this is a test endpoint to create an API key

  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Get('users')
  async getUsers() {
    // testing the API key with the user repository
    const users = await this.dataSource
      .createQueryBuilder()
      .select(`*`)
      .from(User, 'u')
      .leftJoin(ApiKey, 'ak', 'ak.userId = u.id')
      .execute();
    // .where('n.user = :user', { user: user })
    // .orderBy('n.id', 'ASC')
    // .getSql();
    return users;
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Get('check-access-token')
  async checkAccessToken(@Req() request: Request) {
    const testUserDataOnRequest = request['user'];
   
    return testUserDataOnRequest;
  }
}
