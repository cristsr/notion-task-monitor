import { Task } from '../../../domain';
import { Uuid } from '../../../../shared/domain/value-objects';

export abstract class NotionTaskRepositoryPort {
  abstract fetchAll(): Promise<Task[]>;
  abstract fetchById(id: Uuid): Promise<Task>;
  abstract updateVisibility(task: Task): Promise<void>;
}
