import { Test } from '@nestjs/testing';
import { AppRepository } from './app.repository';

describe('AppRepository', () => {
  let service: AppRepository;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppRepository],
    }).compile();

    service = app.get<AppRepository>(AppRepository);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
