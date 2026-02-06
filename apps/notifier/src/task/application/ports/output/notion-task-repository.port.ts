import { Task } from '../../../domain';

export abstract class NotionTaskRepositoryPort {
  abstract fetchAll(): Promise<Task[]>;
  abstract fetchById(id: string): Promise<Task>;
  abstract updateVisibility(task: Task): Promise<void>;
}
