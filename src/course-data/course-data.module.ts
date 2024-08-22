import { Module } from '@nestjs/common';
import { CourseDataService } from './course-data.service';
import { CourseData } from './course-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Chapter } from './entities/chapter.entity';
import { Course } from './entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Chapter, Lesson])],
  controllers: [CourseData],
  providers: [CourseDataService],
})
export class CourseDataModule {}
