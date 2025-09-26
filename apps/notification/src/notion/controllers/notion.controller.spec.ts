import { Test, TestingModule } from '@nestjs/testing';
import { NotionController } from './notion.controller';
import { NotionService } from '../services/notion.service';

describe('NotionController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [NotionController],
      providers: [NotionService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<NotionController>(NotionController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
