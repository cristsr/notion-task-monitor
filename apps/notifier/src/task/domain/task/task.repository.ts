import { Task } from '../index';
import { Uuid } from '../../../shared/domain/value-objects';

export abstract class TaskRepository {
  abstract getAllTask(): Promise<Task[]>;
  abstract save(task: Task): Promise<void>;
  abstract saveMany(tasks: Task[]): Promise<void>;
  abstract findById(id: Uuid): Promise<Task>;
  abstract remove(task: Task): Promise<void>;
}
