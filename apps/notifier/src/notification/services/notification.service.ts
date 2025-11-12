import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NOTIFICATION_STRATEGIES } from '../constants';
import { NotificationStrategies } from './strategies';
import { Notification } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_STRATEGIES)
    private readonly strategies: NotificationStrategies,
  ) {}

  sendNotification(payload: Notification): void {
    const strategy = this.strategies.get(payload.provider);
    if (!strategy) {
      throw new NotFoundException(
        `Notifier provider not found: ${payload.provider}`,
      );
    }
    strategy.notify(payload);
  }
}
