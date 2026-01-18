import { Task } from '../../domain';

export abstract class NotionTaskServicePort {
  abstract fetchTasks(): Promise<Task[]>;
}
