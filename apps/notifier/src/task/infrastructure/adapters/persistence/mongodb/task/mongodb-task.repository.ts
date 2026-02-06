import { TaskRepository, Task } from '../../../../../domain';
import { MongodbTaskMapper } from './mongodb-task.mapper';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongodbTaskEntity } from './mongodb-task.entity';
import { Model } from 'mongoose';
import { Uuid } from '../../../../../../shared/domain/value-objects';

@Injectable()
export class MongodbTaskRepository implements TaskRepository {
  constructor(
    @InjectModel(MongodbTaskEntity.name)
    private readonly taskEntity: Model<MongodbTaskEntity>,
  ) {}

  async findById(id: Uuid): Promise<Task | null> {
    const task = await this.taskEntity.findOne({ id: id.value }).exec();
    if (!task) return null;
    return MongodbTaskMapper.toDomain(task);
  }

  async getAllTask(): Promise<Task[]> {
    const tasks = await this.taskEntity.find().exec();
    return tasks.map(MongodbTaskMapper.toDomain);
  }

  async insert(task: Task): Promise<void> {
    await this.taskEntity.insertOne(MongodbTaskMapper.toEntity(task));
  }

  async update(task: Task): Promise<void> {
    await this.taskEntity.updateOne(
      {
        id: task.id.value,
      },
      {
        $set: MongodbTaskMapper.toEntity(task),
      },
    );
  }

  async save(task: Task): Promise<void> {
    const existTask = await this.findById(task.id);

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
