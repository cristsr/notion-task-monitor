import { DateTime } from 'luxon';
import {
  NotificationStage,
  TaskPriority,
  TaskStatus,
  TaskType,
} from './task.enum';
import { Uuid } from '../../../shared/domain/value-objects';
import { PropertiesOnly } from '../../../shared/infrastructure/types';

export class Task {
  id: Uuid;

  title: string;

  date: DateTime;

  status: TaskStatus;

  priority: TaskPriority;

  type: TaskType;

  assignedTo: string;

  createdBy: string;

  createdAt: DateTime;

  notificationStages: NotificationStage[];

  notifiedAt: DateTime | null;

  private constructor(payload?: Partial<Task>) {
    Object.assign(this, payload);
  }

  static create(payload: PropertiesOnly<Task>): Task {
    return new Task(payload);
  }

  equals(other: Task): boolean {
    const conditions = [
      this.id.equals(other.id),
      this.date.equals(other.date),
      this.type === other.type,
    ];

    return conditions.every(Boolean);
  }

  shouldNotify(): boolean {
    const diff = this.date.diff(DateTime.local());

    if (diff.as('hours') < 0) {
      if (this.type === TaskType.SCHEDULED) return false;
      return DateTime.local().minute === 0;
    }

    if (diff.as('minutes') < 15) {
      return !this.notificationStages.includes(
        NotificationStage.BEFORE_15_MINUTES,
      );
    }

    if (diff.as('hours') < 1) {
      return !this.notificationStages.includes(NotificationStage.BEFORE_1_HOUR);
    }

    if (diff.as('hours') < 24) {
      return !this.notificationStages.includes(
        NotificationStage.BEFORE_24_HOURS,
      );
    }

    return false;
  }

  getNotificationStage(): NotificationStage {
    const diff = this.date.diff(DateTime.local());

    if (diff.as('hours') < 0) {
      return NotificationStage.AFTER_NOW;
    }

    if (diff.as('minutes') < 15) {
      return NotificationStage.BEFORE_15_MINUTES;
    }

    if (diff.as('hours') < 1) {
      return NotificationStage.BEFORE_1_HOUR;
    }

    return NotificationStage.BEFORE_24_HOURS;
  }

  notify() {
    const stage = this.getNotificationStage();
    this.notificationStages.push(stage);
    this.notifiedAt = DateTime.local();
  }
}
