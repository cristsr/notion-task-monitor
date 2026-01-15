import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from '../../notion/services/notion.service';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import dedent from 'dedent';
import { NotificationService } from '../../notification/application/services';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
  ) {}

  async notifyTask() {
    const zone = this.config.get('TIME_ZONE');
    const notificationProvider = this.config.get('NOTIFICATION_PROVIDER');
    const now = DateTime.local({ zone });
    const item = await this.notionService.getNextPage();

    this.logger.log(`Attempting task notification at ${now.toISO()}`);

    if (!item) {
      return {
        success: false,
      };
    }

    this.logger.log(`Notification dispatched: [${item.id}] ${item.title}`);

    const endDate = DateTime.fromISO(item.endDate)
      .setZone(zone)
      .toLocaleString({
        hour: 'numeric',
        minute: 'numeric',
      });

    const message = dedent`
       •
       🔔 Se ha asignado una nueva tarea
       ⏲ Hora de finalizacion: ${endDate}
    `;

    this.notificationService.sendNotification({
      message,
      title: item.title,
      url: item.url,
      urlTitle: '📝 Revisar en Notion',
      ttl: 60 * 60 * 12,
      provider: notificationProvider,
    });

    return {
      success: true,
    };
  }
}
