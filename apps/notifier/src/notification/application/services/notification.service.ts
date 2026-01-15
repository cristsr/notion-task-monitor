import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { NOTIFIERS } from '../ports/output';
import { SendNotificationRequest } from '../dto/input';
import { Notifiers } from '../types';
import { NotificationServicePort } from '../ports/input';

@Injectable()
export class NotificationService implements NotificationServicePort {
  constructor(
    @Inject(NOTIFIERS)
    private readonly notifiers: Notifiers,
  ) {}

  sendNotification(payload: SendNotificationRequest): void {
    const strategy = this.notifiers.get(payload.provider);
    if (!strategy) {
      throw new NotFoundException(
        `Notifier provider not found: ${payload.provider}`,
      );
    }
    strategy.notify(payload);
  }
}
