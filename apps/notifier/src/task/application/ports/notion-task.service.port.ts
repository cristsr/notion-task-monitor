import { Task } from '../../domain';

export abstract class NotionTaskServicePort {
  abstract fetchAll(): Promise<Task[]>;
  abstract fetchById(id: string): Promise<Task>;
}
