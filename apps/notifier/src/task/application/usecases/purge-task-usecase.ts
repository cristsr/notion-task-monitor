import { Injectable } from '@nestjs/common';
import { TaskProviderPort } from '../ports';
import { TaskRepository } from '../../domain';

@Injectable()
export class PurgeTaskUsecase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notionTaskRepository: TaskProviderPort,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.notionTaskRepository.fetchAll();

    const existingTasks = await this.taskRepository.getAllTask();

    const tasksToRemove = existingTasks.filter(
      (exist) => !tasks.some((task) => task.id.equals(exist.id)),
    );

    for (const task of tasksToRemove) {
      await this.taskRepository.remove(task);
    }
  }
}
