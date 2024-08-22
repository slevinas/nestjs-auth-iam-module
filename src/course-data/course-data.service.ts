import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCourseDatumDto } from './dto/create-course-datum.dto';
import { UpdateCourseDatumDto } from './dto/update-course-datum.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseDataService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  create(createCourseDatumDto: CreateCourseDatumDto) {
    return 'This action adds a new courseDatum';
  }

  async getCourseDataFromDb(chaptersOnly = false) {
    const courseRepository = await this.courseRepository.find({
      where: { id: 1 },
      relations: ['chapters', 'chapters.lessons'],
    });
    if (courseRepository.length > 0) {
      
      // Sort chapters by number in descending order
      const sortedChapters = courseRepository[0].chapters.sort(
        (a, b) => a.number - b.number,
      );

      const chapters = sortedChapters.map((chapter) => {
        const lessons = chapter.lessons.map((lesson) => ({
          ...lesson,
          path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
        }));
        return {
          ...chapter,
          lessons,
        };
      });

  
      if (chaptersOnly) {
        return chapters;
      }
      return {
        ...courseRepository[0],
        chapters,
      };
    }
  }

  async getCourseMetaData() {
    const courseRepository = await this.courseRepository.find({
      where: { id: 1 },
      relations: ['chapters', 'chapters.lessons'],
    });

    if (courseRepository.length > 0) {
     
      const courseTitle = courseRepository[0].title;

      // Sort chapters by number in descending order
      const sortedChapters = courseRepository[0].chapters.sort(
        (a, b) => a.number - b.number,
      );

      
      const chapters = sortedChapters.map((chapter) => {
      
        const lessons = chapter.lessons.map((lesson) => ({
          title: lesson.title,
          slug: lesson.slug,
          number: lesson.number,
          path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
        }));
        return {
          ...chapter,
          lessons,
        };
      });
     
      return { courseTitle, chapters };
    }
  }

  async getFirstLesson() {
    return `This action returns a  courseDatum`;
  }

  update(id: number, updateCourseDatumDto: UpdateCourseDatumDto) {
    return `This action updates a #${id} courseDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseDatum`;
  }
}
