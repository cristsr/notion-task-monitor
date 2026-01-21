import { Task } from '../../domain';

export abstract class NotionTaskServicePort {
  abstract execute(): Promise<Task[]>;
}
