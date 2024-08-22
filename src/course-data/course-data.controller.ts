import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CourseDataService } from './course-data.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { SessionGuard } from 'src/iam/authentication/guards/session.guard';
import { LessonProgress } from 'src/course-data/entities/lessonProgress.entity';

// import { DataSource } from 'typeorm';
import { Auth } from 'src/iam/decorators/auth.decorator';
import { AuthType } from 'src/iam/enums/auth-type.enum';
import { DataSource, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import {
  Course as CourseType,
  Lesson as LessonType,
  Chapter as ChapterType,
} from './types/courseData.type';
import { NotFoundError } from 'rxjs';

@Auth(AuthType.None)
@Controller('course-data')
export class CourseData {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepository: Repository<LessonProgress>,
    private readonly courseDataService: CourseDataService,
  ) {}

  // @Post('not-implemented')
  // create(@Body() body: any) {
  //   return this.courseDataService.create(body);
  // }

  // @UseGuards(SessionGuard)
  @Get('update-lesson-progress/:lessonSlug')
  async updateLessonProgress(
    @ActiveUser() user: ActiveUserData,
    @Param() lessonSlug: any,
  ) {
    console.log(
      'From course-data.controller.ts: updateLessonProgress -> lessonSlug',
    );
    console.log(lessonSlug);
    const slug = lessonSlug.lessonSlug;
    console.log(
      'From course-data.controller.ts: updateLessonProgress ->received user',
      user,
    );
    try {
      if (!user) {
        throw new Error(
          'there is no userData attached to the request when updating lesson progress with session guard',
        );
      }
      const userFromDb = await this.usersRepository.findOneBy({
        id: user.sub,
      });
      if (!userFromDb) {
        throw new Error(
          'there is no found with the supplied user id when updating lesson progress with session guard',
        );
      }

      const foundLesson = await this.lessonRepository.findOne({
        where: { slug: slug },
      });
      if (!foundLesson) {
        throw new Error('Lesson with the provided slug was not found');
      }

      // await this.dataSource
      //   .createQueryBuilder()
      //   .insert()
      //   .into(LessonProgress)
      //   .values({
      //     userEmail: userFromDb.email,
      //     completedLessons: [`${foundLesson.id}`],
      //   })
      //   .orUpdate(['userEmail', 'completedLessons'])
      //   .execute();
      console.log('ggggggggggggg');
      console.log(userFromDb.email);
      const lessonProgressRecord = await this.lessonProgressRepository.findOne({
        where: { userEmail: userFromDb.email },
      });

      if (!lessonProgressRecord) {
        const newLessonProgress = new LessonProgress();
        // Add the new lesson to the completedLessons array
        newLessonProgress.completedLessons = [`${foundLesson.id}`];

        newLessonProgress.userEmail = userFromDb.email;

        const lessonProgressSavedRes = await this.dataSource
          .getRepository(LessonProgress)
          .save(newLessonProgress);

        console.log('lessonProgressSavedRes', lessonProgressSavedRes);
      } else {
        // Add the new lesson to the completedLessons array
        lessonProgressRecord.completedLessons = [
          ...(lessonProgressRecord.completedLessons || []),
          `${foundLesson.id}`,
        ];

        const lessonProgressUpdatedRes = await this.lessonProgressRepository
          .createQueryBuilder('lesson_progress')
          .update()
          .set({
            completedLessons: lessonProgressRecord.completedLessons,
          })
          .where('userEmail = :userEmail', { userEmail: userFromDb.email })
          .execute();

        console.log('lessonProgressUpdatedRes', lessonProgressUpdatedRes);

        return lessonProgressUpdatedRes;
      }
    } catch (error) {
      console.error(error);
    }
    // received user { sub: 8, email: 'testuser2@email.com', role: 'admin' }

    // newLessonProgress.userEmail = userFromDb.email;
    // newLessonProgress.completedLessons = foundLesson.id;
    // const lessonProgressSavedRes = await this.dataSource
    //   .getRepository(LessonProgress)
    //   .save(newLessonProgress);

    // console.log('lessonProgressSavedRes', lessonProgressSavedRes);
  }

  // @Auth(AuthType.Bearer)
  @Get('course')
  async getCourseData(@Req() request: Request) {
    const courseData = await this.courseDataService.getCourseDataFromDb();

    return courseData;
  }

  @UseGuards(SessionGuard)
  @Get('lesson-progress')
  async getLessonProgress(@ActiveUser() user: ActiveUserData) {
    // const lessonProgress = await this.dataSource.query(
    //   `SELECT * FROM lesson_progress;`,
    // );
    const userLessonsProgress = await this.dataSource
      .getRepository(LessonProgress)
      .createQueryBuilder('lesson_progress')
      .where('lesson_progress.userEmail = :userEmail', {
        userEmail: user.email,
      })
      .getMany();

    return userLessonsProgress;
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
  update(@Param('id') id: string, @Body() body: any) {
    return this.courseDataService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseDataService.remove(+id);
  }
}
