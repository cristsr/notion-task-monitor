import { Injectable } from '@nestjs/common';
import { NotionTaskServicePort, RetrieveTaskUsecasePort } from '../ports';
import { TaskMapper } from '../mappers';
import { TaskOutput } from '../dto';
import { TaskRepository } from '../../domain/task.repository';

@Injectable()
export class RetrieveTaskUsecase implements RetrieveTaskUsecasePort {
  constructor(
    private readonly notionTaskService: NotionTaskServicePort,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<TaskOutput[]> {
    const tasks = await this.taskRepository.getAllTask();
    return tasks.map(TaskMapper.toDTO);
  }
}
