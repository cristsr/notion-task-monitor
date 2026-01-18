import { TaskPriority, TaskStatus, TaskType } from './task.enum';
import { Uuid } from '../../shared/domain/value-objects';

export class Task {
  id: Uuid;

  title: string;

  date: Date;

  status: TaskStatus;

  priority: TaskPriority;

  type: TaskType;

  notified: boolean;

  assignedTo: string;

  createdBy: string;

  createdAt: Date;

  private constructor(payload?: Partial<Task>) {
    Object.assign(this, payload);
  }

  static create(payload: Partial<Task>): Task {
    return Object.assign(new Task(), payload);
  }

  equals(other: Task): boolean {
    const conditions = [
      this.id.equals(other.id),
      this.title === other.title,
      // this.date?.getTime() === other.date.getTime(),
      this.status === other.status,
      this.priority === other.priority,
      this.type === other.type,
    ];

    return conditions.every(Boolean);
  }
}
