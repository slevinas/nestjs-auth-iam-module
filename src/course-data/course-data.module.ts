import { Module } from '@nestjs/common';
import { CourseDataService } from './course-data.service';
import { CourseData } from './course-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Chapter } from './entities/chapter.entity';
import { Course } from './entities/course.entity';
import { LessonProgress } from './entities/lessonProgress.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Chapter, Lesson, LessonProgress, User]),
  ],
  controllers: [CourseData],
  providers: [CourseDataService],
})
export class CourseDataModule {}
