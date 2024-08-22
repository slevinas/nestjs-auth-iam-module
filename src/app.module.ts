import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { CoffeesModule } from './coffees/coffees.module';
import { IamModule } from './iam/iam.module';
import { JwtModule } from '@nestjs/jwt';
import { PetsModule } from './pets/pets.module';
import { CourseDataModule } from './course-data/course-data.module';
import jwtConfig from './config/jwt.config';

const envFilePath = `${process.env.NODE_ENV ?? ''}.env`;
const typeormConfigFilePath =
  process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd;



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV ?? ''}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    UsersModule,
    // AuthModule,
    CoffeesModule,
    IamModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    PetsModule,
    CourseDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    console.log(
      ` Hi Ziggiii the DB name is ${this.configService.get(
        'DB_NAME',
      )} \n and the DB host is ${this.configService.get('DB_HOST')} '`,
    );
  }
  // dbUser = this.configService.get<string>('DATABASE_USER');
  // // get a custom configuration value
  // dbHost = this.configService.get<string>('database.host');
}
