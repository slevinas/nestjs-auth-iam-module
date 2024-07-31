import {
  IsEmail,
  IsNumberString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(1)
  password: string;

  displayName?: string;

  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}
