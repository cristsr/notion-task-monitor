import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';

describe('TaskController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<TaskController>(TaskController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
