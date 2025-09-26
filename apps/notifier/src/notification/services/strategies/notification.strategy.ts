export abstract class NotificationStrategy {
  abstract instance: string;
  abstract notify(payload: Notification): Promise<void> | void;
}

export type NotificationStrategies = Map<
  NotificationTypes,
  NotificationStrategy
>;

export interface Notification {
  title: string;
  message: string;
  url: string;
  urlTitle: string;
  ttl: number;
}

export enum NotificationTypes {
  PUSHOVER = 'PUSHOVER',
}
