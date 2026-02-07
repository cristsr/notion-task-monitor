import { Injectable } from '@nestjs/common';
import { TaskProviderPort } from '../ports';
import { TaskRepository } from '../../domain';

@Injectable()
export class VisibilityTaskUsecase {
  private readonly HOURS_TO_HIDE = 48;

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notionRepository: TaskProviderPort,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.taskRepository.getAllTask();

    for (const task of tasks) {
      if (!task.mustBeVisible(this.HOURS_TO_HIDE)) continue;
      task.setVisible(true);
      await this.taskRepository.save(task);
      await this.notionRepository.update(task);
    }
  }
}
