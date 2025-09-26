import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from '../services/notification.service';

describe('NotificationsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<NotificationsController>(
        NotificationsController,
      );
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
