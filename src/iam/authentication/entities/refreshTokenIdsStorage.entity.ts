import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity()
// @ObjectType()
export class RefreshTokenIdsStorage {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryColumn()
  // @Expose()
  // @Field(() => Int)
  id: number;

  @Column({ unique: true })
  // @Expose()
  // @Field()
  refreshTokenId: string;
}
