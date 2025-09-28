import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from '../../notion/services/notion.service';
import { NotificationService } from '../../notification/services/notification.service';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import dedent from 'dedent';

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
      🚨 ¡NUEVA MISIÓN ASIGNADA! 🚨
      🌱 Recuerda avanzar sin prisa pero sin pausa.
      ⏰ Deadline: ${endDate}
      🎯 ¡Es hora de brillar!
    `;

    this.notificationService.sendNotification({
      message,
      title: item.title,
      url: item.url,
      urlTitle: '📝 Revisar en Notion',
      ttl: 60 * 60 * 12,
    });

    return {
      success: true,
    };
  }
}
