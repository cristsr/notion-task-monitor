import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_STRATEGIES } from '../constants';
import { NotificationStrategies, NotificationTypes } from './strategies';
import { Notification } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_STRATEGIES)
    private readonly strategies: NotificationStrategies,
  ) {}

  sendNotification(payload: Notification): void {
    // By default, use pushover, maybe can be an env var
    const strategy = this.strategies.get(NotificationTypes.PUSHOVER);
    strategy.notify(payload);
  }
}
