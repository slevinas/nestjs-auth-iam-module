import { PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PartialType(User) {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
   
  }
}
