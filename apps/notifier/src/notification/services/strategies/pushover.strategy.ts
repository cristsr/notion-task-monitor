import { Injectable, Logger } from '@nestjs/common';
import {
  NotificationStrategy,
  Notification,
  NotificationTypes,
} from './notification.strategy';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushoverStrategy implements NotificationStrategy {
  private readonly logger = new Logger(PushoverStrategy.name);
  public readonly instance = NotificationTypes.PUSHOVER;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  /**
   * Notify
   * @param payload
   */
  notify(payload: Notification): void {
    const url = this.config.get('PUSHOVER_URL') + '/1/messages.json';
    const token = this.config.get('PUSHOVER_API_KEY');
    const user = this.config.get('PUSHOVER_API_USER');

    this.http
      .post(
        url,
        new URLSearchParams({
          token,
          user,
          message: payload.message,
          title: payload.title,
          url: payload.url,
          url_title: payload.urlTitle,
          ttl: payload.ttl.toString(),
        }),
      )
      .subscribe({
        next: (response) => {
          this.logger.log(`Notification sent successfully`);
          this.logger.log(`Notification request id: ${response.data.request}`);
        },
        error: (error) => {
          this.logger.error(error.response.data);
          this.logger.error(error.message);
        },
      });
  }
}
