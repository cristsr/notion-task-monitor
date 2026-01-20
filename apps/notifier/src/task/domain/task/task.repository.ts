import { Task } from '../index';

export abstract class TaskRepository {
  abstract getAllTask(): Promise<Task[]>;
  abstract save(task: Task): Promise<void>;
  abstract saveMany(tasks: Task[]): Promise<void>;
  abstract findById(id: string): Promise<Task>;
  abstract remove(task: Task): Promise<void>;
}
