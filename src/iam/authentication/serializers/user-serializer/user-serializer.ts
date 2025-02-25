import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../../../users/entities/user.entity';
import { ActiveUserData } from '../../../interfaces/active-user-data.interface';
import { Role } from 'src/users/enums/role.enum';

export class UserSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: ActiveUserData) => void) {
    done(null, {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });
  }

  async deserializeUser(
    payload: ActiveUserData,
    done: (err: Error, user: ActiveUserData) => void,
  ) {
    done(null, payload);
  }
}
