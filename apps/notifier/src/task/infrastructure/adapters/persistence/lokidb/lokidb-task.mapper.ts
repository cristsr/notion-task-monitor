import { Task } from '../../../../domain';
import { LokidbTaskEntity } from './lokidb-task.entity';
import { Uuid } from '../../../../../shared/domain/value-objects';

export class LokidbTaskMapper {
  static toEntity(task: Task): LokidbTaskEntity {
    return new LokidbTaskEntity({
      id: task.id.value,
      date: task.date,
      notified: task.notified,
    });
  }

  static toDomain(task: LokidbTaskEntity): Task {
    return Task.create({
      id: Uuid.create(task.id),
      date: task.date,
      notified: task.notified,
    });
  }
}
