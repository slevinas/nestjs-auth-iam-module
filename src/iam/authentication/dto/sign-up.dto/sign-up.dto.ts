import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../../../users/entities/user.entity';

export class SignUpDto extends PartialType(User) {
  constructor(partial?: Partial<SignUpDto>) {
    super();
    Object.assign(this, partial);
  }
}
