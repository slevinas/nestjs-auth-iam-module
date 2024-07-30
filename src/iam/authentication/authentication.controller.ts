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
import { getRepository, Repository } from 'typeorm';

import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { ApiKeysService } from './api-keys.service';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    @InjectDataSource() private readonly dataSource: any,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  @Get('create-api-key')
  async createApiKey() {
    const apiKeyAndHash = await this.apiKeysService.createAndHash(5);
    console.log('apiKeyAndHash', apiKeyAndHash);
    /*
    apiKey 5 28019a18-5e4d-44e6-b019-119e283e894d
    apiKeyAndHash {
      apiKey: 'NSAyODAxOWExOC01ZTRkLTQ0ZTYtYjAxOS0xMTllMjgzZTg5NGQ=',
      hashedKey: '$2b$10$RIfFQejmCzFfVO4YmZHcpOOlNYaU0gdeAjlN4V0UwaKzs4x.0DigK'
    }

*/
    // const apiKey = new ApiKey();
    // apiKey.key = apiKeyAndHash.hashedKey;
    // apiKey.uuid = '5';
    // apiKey.user = existingUser;

    // Save the ApiKey instance to the database
    // await this.apiKeyRepository.save(apiKey);

    return await this.apiKeyRepository.save({
      key: apiKeyAndHash.hashedKey,
      uuid: randomUUID(),
      user: { id: 8 },
      });
  } // this is a test endpoint to create an API key

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log('signUpDto', signUpDto);
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    // console.log('from signIn controller the request is', request);
    // return this.authService.signIn(signInDto);
    const accessToken = await this.authService.signIn(signInDto);
    // Set the cookie with the access token
    // response.cookie('accessToken', accessToken, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });
    return accessToken;
  }
  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  // @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
  //   // return this.authService.signIn(signInDto);
  //   // const userObject = request.user;
  //   // console.log('from signIn controller the request is', request);
  //   const accessToken = await this.authService.signIn(signInDto);
  //   return accessToken;
  // }
  @Get('users')
  async getUsers() {
    const users = await this.dataSource
      .createQueryBuilder()
      .select(`*`)
      .from(ApiKey, 'u')
      .execute();
    // .where('n.user = :user', { user: user })
    // .orderBy('n.id', 'ASC')
    // .getSql();
    return users;
  }
}
