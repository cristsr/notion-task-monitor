import { Test } from '@nestjs/testing';
import { NotionRepository } from './notion.repository';

describe('NotionRepository', () => {
  let service: NotionRepository;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [NotionRepository],
    }).compile();

    service = app.get<NotionRepository>(NotionRepository);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
