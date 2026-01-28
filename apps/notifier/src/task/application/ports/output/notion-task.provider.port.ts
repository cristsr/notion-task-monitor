import { Task } from '../../../domain';

export abstract class NotionTaskProviderPort {
  abstract fetchAll(): Promise<Task[]>;
  abstract fetchById(id: string): Promise<Task>;
}
