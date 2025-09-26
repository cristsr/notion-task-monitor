import { Module, ValidationPipe } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationService } from './services/notification.service';
import { APP_PIPE } from '@nestjs/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { NOTIFICATION_STRATEGIES } from './constants';
import {
  NotificationProviders,
  NotificationStrategy,
} from './services/strategies';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    ...NotificationProviders,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: Cache,
      useExisting: CACHE_MANAGER,
    },
    {
      provide: NOTIFICATION_STRATEGIES,
      useFactory: (...providers: NotificationStrategy[]) => {
        return new Map<string, NotificationStrategy>(
          providers.map((p) => [p.instance, p]),
        );
      },
      inject: NotificationProviders,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
