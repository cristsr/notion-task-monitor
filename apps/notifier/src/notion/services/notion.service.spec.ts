import { Test } from '@nestjs/testing';
import { NotionService } from './notion.service';

describe('NotionService', () => {
  let service: NotionService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [NotionService],
    }).compile();

    service = app.get<NotionService>(NotionService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.onModuleInit()).toEqual({ message: 'Hello API' });
    });
  });
});
