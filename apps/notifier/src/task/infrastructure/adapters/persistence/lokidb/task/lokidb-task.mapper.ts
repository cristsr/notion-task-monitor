import { NotificationStage, Task } from '../../../../../domain';
import { LokidbTaskEntity } from './lokidb-task.entity';
import { Uuid } from '../../../../../../shared/domain/value-objects';
import { DateTime } from 'luxon';

export class LokidbTaskMapper {
  static toEntity(task: Task): LokidbTaskEntity {
    return new LokidbTaskEntity({
      id: task.id.value,
      date: task.date.toISO(),
      title: task.title,
      status: task.status,
      type: task.type,
      assignedTo: task.assignedTo,
      priority: task.priority,
      createdAt: task.createdAt.toISO(),
      createdBy: task.createdBy,
      notificationStages: task.notificationStages,
      notifiedAt: task.notifiedAt?.toISO(),
      url: task.url,
    });
  }

  static toDomain(task: LokidbTaskEntity): Task {
    const payload: Partial<Task> = {
      id: Uuid.create(task.id),
      date: DateTime.fromISO(task.date),
      title: task.title,
      status: task.status,
      type: task.type,
      assignedTo: task.assignedTo,
      priority: task.priority,
      createdAt: DateTime.fromISO(task.createdAt),
      createdBy: task.createdBy,
      notificationStages: task.notificationStages as NotificationStage[],
      url: task.url,
    };

    if (task.notifiedAt) {
      payload.notifiedAt = DateTime.fromISO(task.notifiedAt);
    }

    return Task.create(payload as Task);
  }
}
