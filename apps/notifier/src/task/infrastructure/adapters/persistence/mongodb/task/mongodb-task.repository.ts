import { TaskRepository, Task } from '../../../../../domain';
import { MongodbTaskMapper } from './mongodb-task.mapper';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongodbTaskEntity } from './mongodb-task.entity';
import { Model } from 'mongoose';

@Injectable()
export class MongodbTaskRepository implements TaskRepository {
  constructor(
    @InjectModel(MongodbTaskEntity.name)
    private taskEntity: Model<MongodbTaskEntity>,
  ) {}

  async findById(id: string): Promise<Task | null> {
    const task = await this.taskEntity.findOne({ id }).exec();
    if (!task) return null;
    return MongodbTaskMapper.toDomain(task);
  }

  async getAllTask(): Promise<Task[]> {
    const tasks = await this.taskEntity.find().exec();
    return tasks.map(MongodbTaskMapper.toDomain);
  }

  async save(task: Task): Promise<void> {
    const existTask = await this.findById(task.id.value);

    if (!existTask) {
      await this.taskEntity.insertOne(MongodbTaskMapper.toEntity(task));
      return;
    }

    await this.taskEntity
      .updateOne(
        {
          id: task.id.value,
        },
        {
          $set: MongodbTaskMapper.toEntity(task),
        },
      )
      .exec();
  }

  async saveMany(tasks: Task[]): Promise<void> {
    tasks.forEach((t) => this.save(t));
  }

  async remove(task: Task): Promise<void> {
    await this.taskEntity
      .deleteOne({
        id: task.id.value,
      })
      .exec();
  }
}
