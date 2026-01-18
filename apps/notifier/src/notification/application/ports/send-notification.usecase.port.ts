import { NotificationInput } from '../dto';

export abstract class SendNotificationUsecasePort {
  abstract execute(payload: NotificationInput): void;
}
