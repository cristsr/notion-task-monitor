import { Task } from '../../domain';
import { Uuid } from '../../../shared/domain/value-objects';

export abstract class TaskProviderPort {
  abstract fetchAll(): Promise<Task[]>;
  abstract fetchById(id: Uuid): Promise<Task>;
  abstract update(task: Task): Promise<void>;
}
