import { Injectable } from '@nestjs/common';
import { TaskMapper } from '../mappers';
import { TaskOutput } from '../dto';
import { TaskRepository } from '../../domain';

@Injectable()
export class RetrieveTaskUsecase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<TaskOutput[]> {
    const tasks = await this.taskRepository.getAllTask();
    return tasks.map(TaskMapper.toDTO);
  }
}
