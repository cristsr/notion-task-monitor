import { Injectable } from '@nestjs/common';
import { ManageTaskUseCasePort, NotionTaskProviderPort } from '../ports';
import { Uuid } from '../../../shared/domain/value-objects';
import { Promise } from 'mongoose';
import { TaskRepository } from '../../domain';

@Injectable()
export class ManageTaskUsecase implements ManageTaskUseCasePort {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notionTaskService: NotionTaskProviderPort,
  ) {}

  async syncTask(taskId: Uuid): Promise<void> {
    const task = await this.notionTaskService.fetchById(taskId.value);

    if (task.isDone()) {
      await this.taskRepository.remove(task);
      return;
    }

    await this.taskRepository.save(task);
  }

  async removeTask(taskId: Uuid): Promise<void> {
    const task = await this.taskRepository.findById(taskId.value);
    await this.taskRepository.remove(task);
  }
}
