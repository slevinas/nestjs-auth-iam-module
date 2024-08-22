import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CourseDataService } from './course-data.service';
import { CreateCourseDatumDto } from './dto/create-course-datum.dto';
import { UpdateCourseDatumDto } from './dto/update-course-datum.dto';
// import { DataSource } from 'typeorm';
import { Auth } from 'src/iam/decorators/auth.decorator';
import { AuthType } from 'src/iam/enums/auth-type.enum';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Request } from 'express';
import {
  Course as CourseType,
  Lesson as LessonType,
  Chapter as ChapterType,
} from './types/courseData.type';

@Auth(AuthType.None)
@Controller('course-data')
export class CourseData {
  constructor(
    @InjectDataSource() private readonly dataSource: any,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly courseDataService: CourseDataService,
  ) {}

  @Post('not-implemented')
  create(@Body() createCourseDatumDto: CreateCourseDatumDto) {
    return this.courseDataService.create(createCourseDatumDto);
  }

  // @Auth(AuthType.Bearer)
  @Get('course')
  async getCourseData(@Req() request: Request,) {
  
    const courseData = await this.courseDataService.getCourseDataFromDb();
 
    return courseData;
  }

  @Get('course-meta')
  async getCourseMeta() {
    const courseMetaData = await this.courseDataService.getCourseMetaData();

   
    return courseMetaData;
  }

  @Get('course-meta-2')
  async getCourseMeta2() {
    try {
      
      const result = await this.dataSource
        .query(`SELECT "course"."id" AS "course_id",
        "course"."title" AS "course_title",
        "chapter"."title" AS Course__Course_chapters_title,
        "chapter"."slug" AS Course__Course_chapters_slug, 
        "chapter"."number" AS Course__Course_chapters_number,
        "lesson"."title" AS Course__Course_chapters__Course__Course_chapters_lessons_title,
        "lesson"."slug" AS Course__Course_chapters__Course__Course_chapters_lessons_slug,
        "lesson"."number" AS Course__Course_chapters__Course__Course_chapters_lessons_number 
        FROM "course" "course" 
        LEFT JOIN "chapter" "chapter" ON "chapter"."courseId"="course"."id"  
        LEFT JOIN "lesson" "lesson" ON "lesson"."chapterId"="chapter"."id" 
        ORDER BY   "chapter"."id",  "lesson"."id";`);


      if (result) {
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  }

  @Get('first-lesson')
  async getFirstLesson() {
    const firstLessong = await this.lessonRepository.find({
      where: { id: 1 },
    });

    

    if (firstLessong) {
  
      const path =
        '/course/chapter/1-chapter-1/lesson/1-introduction-to-typescript-with-vue-js-3';
      return { ...firstLessong[0], path };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseDataService.getFirstLesson();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDatumDto: UpdateCourseDatumDto,
  ) {
    return this.courseDataService.update(+id, updateCourseDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseDataService.remove(+id);
  }
}
