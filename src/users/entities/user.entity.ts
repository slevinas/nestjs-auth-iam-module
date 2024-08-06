import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { PermissionType } from 'src/iam/authorization/permission.type';
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

export enum CoffeesPermission {
  CreateCoffee = 'create_coffee',
  UpdateCoffee = 'update_coffee',
  DeleteCoffee = 'delete_coffee',
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

  @Optional()
  @Column({ unique: true, nullable: true })
  // @Expose()
  // @Field()
  username?: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ unique: true })
  // @Expose()
  // @Field()
  email?: string;

  @Column({ default: false })
  isTfaEnabled: boolean; //

  @Column({ nullable: true })
  tfaSecret: string;

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
  // NOTE: Having the "permissions" column in combination with the "role"
  // likely does not make sense. We use both in this course just to showcase
  // two different approaches to authorization.

  @Optional()
  @Column('json', { nullable: true })
  permissions?: string[];

  @JoinTable()
  @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
  apiKeys: ApiKey[]; // relationship with ApiKey Entity
}
