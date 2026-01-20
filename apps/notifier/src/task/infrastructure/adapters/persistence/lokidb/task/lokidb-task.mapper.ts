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
    });
  }

  static toDomain(task: LokidbTaskEntity): Task {
    return Task.create({
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
      notifiedAt: DateTime.fromISO(task.notifiedAt),
    });
  }
}
