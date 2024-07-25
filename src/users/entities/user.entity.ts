import { Expose } from 'class-transformer';
import { Optional } from '@nestjs/common';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  // @OneToOne(() => Profile)
  // @JoinColumn()
  // @Expose()
  // profile: Profile;

  // @OneToMany(() => Event, (event) => event.organizer)
  // @Expose()
  // organized: Event[];

  // @OneToMany(() => Attendee, (attendee) => attendee.user)
  // attended: Attendee[];
}
