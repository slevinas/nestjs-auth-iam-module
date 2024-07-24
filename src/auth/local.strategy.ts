import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    console.log('LocalStrategy constructor');
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('LocalStrategy validate has been called');
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      console.log('LocalStrategy validate user is null');
      throw new UnauthorizedException();
    }
    console.log('LocalStrategy validate user: ', user);
    return user;
  }
}
