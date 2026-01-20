import { TaskRepository, Task } from '../../../../../domain';
import { LokidbTaskMapper } from './lokidb-task.mapper';
import { LokidbTaskCollection } from './lokidb-task.collection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LokidbTaskRepository implements TaskRepository {
  constructor(private readonly tasksCollection: LokidbTaskCollection) {}

  async findById(id: string): Promise<Task | null> {
    const task = this.tasksCollection.findOne({ id });
    if (!task) return null;
    return LokidbTaskMapper.toDomain(task);
  }

  async getAllTask(): Promise<Task[]> {
    const tasks = this.tasksCollection.find();
    return tasks.map(LokidbTaskMapper.toDomain);
  }

  async save(task: Task): Promise<void> {
    const existTask = await this.findById(task.id.value);

    if (!existTask) {
      this.tasksCollection.insertOne(LokidbTaskMapper.toEntity(task));
      return;
    }

    this.tasksCollection.updateWhere(
      (obj) => obj.id === task.id.value,
      (obj) => ({ ...obj, ...LokidbTaskMapper.toEntity(task) }),
    );
  }

  async saveMany(tasks: Task[]): Promise<void> {
    tasks.forEach((t) => this.save(t));
  }

  async remove(task: Task): Promise<void> {
    this.tasksCollection.removeWhere((obj) => obj.id === task.id.value);
  }
}
