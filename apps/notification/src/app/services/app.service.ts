import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from '../../notion/services/notion.service';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly notificationService: NotificationService,
  ) {}

  async notifyTask() {
    const item = await this.notionService.getNextPage();

    if (!item) {
      return {
        success: false,
      };
    }

    this.logger.log(`Sending notification for ${item.title}`);

    this.notificationService.sendNotification({
      message: `Nueva tarea pendiente que termina en: hora`,
      title: item.title,
      url: item.url,
      urlTitle: 'Ver en Notion',
      ttl: 60 * 60 * 12,
    });

    return {
      success: true,
    };
  }
}
