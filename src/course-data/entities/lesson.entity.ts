import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeUpdate,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { Chapter } from './chapter.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  title?: string;

  @Column()
  slug: string;

  @Column()
  number: number;

  @Column()
  downloadUrl?: string;

  @Column()
  sourceUrl?: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value ? Number(value) : value))
  videoId?: number;

  @Column()
  text: string;

  @ManyToOne((type) => Chapter, (chapter) => chapter.lessons)
  chapter: Chapter;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
