import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { NOTIFIERS, SendNotificationUsecasePort } from '../ports';
import { NotificationInput } from '../dto';
import { Notifiers } from '../types';

@Injectable()
export class SendNotificationUsecase implements SendNotificationUsecasePort {
  constructor(
    @Inject(NOTIFIERS)
    private readonly notifiers: Notifiers,
  ) {}

  execute(payload: NotificationInput): void {
    const strategy = this.notifiers.get(payload.provider);
    if (!strategy) {
      throw new NotFoundException(
        `Notifier provider not found: ${payload.provider}`,
      );
    }
    strategy.notify(payload);
  }
}
