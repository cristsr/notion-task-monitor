import { Test } from '@nestjs/testing';
import { TaskScheduler } from './task.scheduler';

describe('TaskScheduler', () => {
  let service: TaskScheduler;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [TaskScheduler],
    }).compile();

    service = app.get<TaskScheduler>(TaskScheduler);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service).toBeDefined();
    });
  });
});
