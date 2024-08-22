import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, Min, MinLength } from 'class-validator';
import { User } from '../../../users/entities/user.entity';

export class SignUpDto extends PartialType(User) {
  constructor(partial?: Partial<SignUpDto>) {
    super();
    Object.assign(this, partial);
  }
  @IsEmail()
  email?: string;

  @MinLength(2)
  password?: string;
}
