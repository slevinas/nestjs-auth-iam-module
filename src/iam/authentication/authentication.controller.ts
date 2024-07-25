import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

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
  // @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
  //   // return this.authService.signIn(signInDto);
  //   // const userObject = request.user;
  //   // console.log('from signIn controller the request is', request);
  //   const accessToken = await this.authService.signIn(signInDto);
  //   return accessToken;
  // }
}
