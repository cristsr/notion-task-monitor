import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from '../../notion/services/notion.service';
import { NotificationService } from '../../notification/services/notification.service';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
  ) {}

  async notifyTask() {
    const item = await this.notionService.getNextPage();

    if (!item) {
      return {
        success: false,
      };
    }

    this.logger.log(`Sending notification for ${item.title}`);

    const zone = this.config.get('TIME_ZONE');
    const endDate = DateTime.fromISO(item.endDate).setZone(zone);

    this.notificationService.sendNotification({
      message: `Nueva tarea pendiente que termina en: ${endDate.toLocaleString()}`,
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
