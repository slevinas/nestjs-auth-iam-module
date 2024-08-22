import { Test, TestingModule } from '@nestjs/testing';
import { CourseDataController } from './course-data.controller';
import { CourseDataService } from './course-data.service';

describe('CourseDataController', () => {
  let controller: CourseDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseDataController],
      providers: [CourseDataService],
    }).compile();

    controller = module.get<CourseDataController>(CourseDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
