import { TaskRepository } from '../../../../domain/task.repository';
import { Task } from '../../../../domain';
import { LokidbTaskMapper } from './lokidb-task.mapper';
import { LokidbTaskCollection } from './lokidb-task.collection';
import { Injectable } from '@nestjs/common';
import { LokidbConnection } from '../../../../../shared/infrastructure/config/lokidb';

@Injectable()
export class LokidbTaskRepository implements TaskRepository {
  constructor(
    private readonly tasksCollection: LokidbTaskCollection,
    private readonly connection: LokidbConnection,
  ) {}

  async findById(id: string): Promise<Task | null> {
    const task = this.tasksCollection.findOne({ id });
    if (!task) return null;
    return LokidbTaskMapper.toDomain(task);
  }

  async getAllTask(): Promise<Task[]> {
    const task = this.tasksCollection.find();
    return task.map(LokidbTaskMapper.toDomain);
  }

  async save(task: Task): Promise<void> {
    const existTask = await this.findById(task.id.value);

    if (!existTask) {
      this.tasksCollection.insertOne(LokidbTaskMapper.toEntity(task));
      return;
    }

    if (existTask.equals(task)) return;

    this.tasksCollection.updateWhere(
      (obj) => obj.id === task.id.value,
      (obj) => ({ ...obj, ...LokidbTaskMapper.toEntity(task) }),
    );
  }

  async saveMany(tasks: Task[]): Promise<void> {
    tasks.forEach((t) => this.save(t));
  }
}
