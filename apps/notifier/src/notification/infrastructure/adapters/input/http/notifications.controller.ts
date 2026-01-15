import { Body, Controller, Post } from '@nestjs/common';
import { SendNotificationRequest } from '../../../../application/dto/input';
import { NotificationService } from '../../../../application/services';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly sendNotificationUseCase: NotificationService) {}

  @Post('notify')
  sendNotification(@Body() data: SendNotificationRequest): void {
    this.sendNotificationUseCase.sendNotification(data);
  }
}
