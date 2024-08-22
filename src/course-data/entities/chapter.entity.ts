import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title?: string;

  @Column()
  slug: string;

  @Column()
  number: number;

  @ManyToOne((type) => Course, (course) => course.chapters)
  course: Course;

  @OneToMany((type) => Lesson, (lesson) => lesson.chapter, { cascade: true })
  lessons: Lesson[];
}
