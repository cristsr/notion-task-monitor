import { Injectable } from '@nestjs/common';
import { RetrieveTaskUsecasePort } from '../ports';
import { TaskMapper } from '../mappers';
import { TaskOutput } from '../dto';
import { TaskRepository } from '../../domain';

@Injectable()
export class RetrieveTaskUsecase implements RetrieveTaskUsecasePort {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<TaskOutput[]> {
    const tasks = await this.taskRepository.getAllTask();
    return tasks.map(TaskMapper.toDTO);
  }
}
