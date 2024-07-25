import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { LocalAuthGuard } from './auth/local-auth.guard';
// import { AuthGuard } from './auth/passport-auth.guard';
// import { AuthService } from './auth/auth.service';
// import { Auth } from './auth/entities/auth.entity';

@Controller()
export class AppController {
  // constructor(private authService: AuthService) {}

  // // @UseGuards(AuthGuard('local'))
  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   console.log('login was called with req: ', req);
  //   return this.authService.login(req.user);
  //   // return req.user;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   console.log('getProfile was called with req.user: ', req.user);
  //   return req.user;
  // }
}
