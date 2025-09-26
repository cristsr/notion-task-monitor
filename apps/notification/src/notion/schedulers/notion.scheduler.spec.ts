import { Test } from '@nestjs/testing';
import { NotionScheduler } from './notion.scheduler';

describe('NotionScheduler', () => {
  let service: NotionScheduler;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [NotionScheduler],
    }).compile();

    service = app.get<NotionScheduler>(NotionScheduler);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
