import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiKey } from '../api-keys/entities/api-key.entity/api-key.entity';
// import { Attendee } from './../events/attendee.entity';
// import { Event } from './../events/event.entity';
// import { Profile } from './profile.entity';
// import { Field, Int, ObjectType } from '@nestjs/graphql';
export enum Role {
  Regular = 'regular',
  Admin = 'admin',
}

@Entity()
// @ObjectType()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  // @Expose()
  // @Field(() => Int)
  id: number;

  @Column({ unique: true })
  // @Expose()
  // @Field()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  // @Expose()
  // @Field()
  email?: string;

  @Optional()
  @Column({ nullable: true })
  // @Expose()
  // @Field()
  firstName?: string;

  @Optional()
  @Column({ nullable: true })
  // @Expose()
  // @Field()
  lastName?: string;

  @Optional()
  @Column({ enum: Role, default: Role.Regular, nullable: true })
  role?: string;

  // @Optional()
  // @Column({ enum: Permission, default: [],type 'json'})
  // permissions?: PermissionType[];

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[]; // 👈 relationship with ApiKey Entity
}
