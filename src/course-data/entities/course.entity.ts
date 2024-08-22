import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  title?: string;

  @OneToMany((type) => Chapter, (chapter) => chapter.course, { cascade: true })
  chapters: Chapter[];
}
