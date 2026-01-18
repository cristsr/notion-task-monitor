import { Injectable } from '@nestjs/common';
import { NotionTaskServicePort } from '../ports';
import { TaskRepository } from '../../domain/task.repository';
import { SyncTaskUsecasePort } from '../ports/sync-task.usecase.port';

@Injectable()
export class SyncTaskUsecase implements SyncTaskUsecasePort {
  constructor(
    private readonly notionTaskService: NotionTaskServicePort,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.notionTaskService.fetchTasks();
    await this.taskRepository.saveMany(tasks);
  }
}
