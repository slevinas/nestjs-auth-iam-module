import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Profile } from './../auth/profile.entity';
// import { User } from './../auth/user.entity';
// import { Attendee } from './../events/attendee.entity';
// import { Event } from './../events/event.entity';
// import { Subject } from './../school/subject.entity';
// import { Teacher } from './../school/teacher.entity';
// import { Course } from './../school/course.entity';
// import { TypeOrmUser } from '../typeorm-practice/entities/user.entity';
// import { Photo } from '../typeorm-practice/entities/photo.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    synchronize: true,
    // dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
    logging: true,
  }),
);
