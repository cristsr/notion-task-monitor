import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly appService: NotificationService) {}

  @Post('notify')
  getData(@Body() data: Notification) {
    this.appService.sendNotification(data);

    return {
      success: true,
    };
  }
}
