// pnpm install --save @nestjs/config
// pnpm i bcrypt
// pnpm i @types/bcrypt -D

// // generate IAM module & Hashing / BCrypt files
nest g module iam
nest g service iam/hashing
nest g service iam/hashing/bcrypt --flat

// generate IAM module & Hashing / BCrypt files
nest g module iam
nest g service iam/hashing
nest g service iam/hashing/bcrypt --flat

// ◾️ Terminal
// Generate Authentication Controller
nest g controller iam/authentication

// Generate Authentication Service
nest g service iam/authentication

// Let’s generate the DTO (or Data Transfer Object) classes for 2 endpoints
// we plan on exposing in our application: SignInDto and SignUpDto
nest g class iam/authentication/dto/sign-in.dto --no-spec
nest g class iam/authentication/dto/sign-up.dto --no-spec

// Install dependencies needed
npm i class-validator class-transformer 

// 📝 main.ts file - add ValidationPipe
app.useGlobalPipes(new ValidationPipe());

// --- DTO files ---

// 📝 signup.dto.ts
import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}

// 📝 signin.dto.ts
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}


// ------
// 📝 authentication.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    // TODO: We'll fill this gap in the next lesson
    return true;
  }
}

// 📝 authentication.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, we wanted 200 - hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}

// 🌚 Insomnia - signup
http://localhost:3000/authentication/sign-up
// 🌚 Insomnia - signin
http://localhost:3000/authentication/sign-in

// example payload for email/poassword
{
	"email": "user1@nestjs.com",
	"password": "Password!123"
}


-- 3


----------------------------------

// Create new application (name it whatever you prefer!)
nest new auth-extension

//️ Create a new Coffees & Users "RESOURCE"
nest g resource coffees
nest g resource users

// ⚙️ Start NestJS in Dev mode
npm run start:dev

// ⚙️ docker-compose.yml file contents
version: "3"
services:
 db:
   image: postgres
   restart: always
   ports:
     - "5432:5432"
   environment:
     POSTGRES_PASSWORD: pass123
     
/*
 * Start docker-compose
 * NOTE: docker-compose down (to take it down)
 */
docker-compose up -d

/*
 * Install needed dependencies
 */
npm install @nestjs/typeorm typeorm pg

// TypeOrm module info (username/password/etc from our docker-compose file)
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  autoLoadEntities: true,
  synchronize: true,
}),

/*
 * User Entity
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
