import { Transform } from 'class-transformer';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { Lesson } from './lesson.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  userEmail: string;

  @Column('json', { nullable: true })
  completedLessons: string[];

  // @ManyToMany(() => Lesson, { cascade: true })
  // @JoinTable()
  // completedLessons: Lesson[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
