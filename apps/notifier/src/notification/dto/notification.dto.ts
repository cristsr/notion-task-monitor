import { NotificationTypes } from '../services/strategies';

export class Notification {
  title: string;

  message: string;

  url: string;

  urlTitle: string;

  ttl: number;

  provider: NotificationTypes;
}
