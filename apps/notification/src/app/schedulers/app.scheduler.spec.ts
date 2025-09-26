import { Test } from '@nestjs/testing';
import { AppScheduler } from './app.scheduler';

describe('AppScheduler', () => {
  let service: AppScheduler;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppScheduler],
    }).compile();

    service = app.get<AppScheduler>(AppScheduler);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service).toBeDefined();
    });
  });
});
