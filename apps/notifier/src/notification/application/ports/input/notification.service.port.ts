import { SendNotificationRequest } from '../../dto/input';

export abstract class NotificationServicePort {
  abstract sendNotification(payload: SendNotificationRequest): void;
}
