import { Body, Controller, Post } from '@nestjs/common';
import { NotificationInput } from '../../../application/dto';
import { SendNotificationUsecasePort } from '../../../application/ports';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUsecasePort,
  ) {}

  @Post('notify')
  sendNotification(@Body() data: NotificationInput): void {
    this.sendNotificationUseCase.execute(data);
  }
}
