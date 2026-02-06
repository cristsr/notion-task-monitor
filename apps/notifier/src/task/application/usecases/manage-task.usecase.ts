import { Injectable, Logger } from '@nestjs/common';
import { ManageTaskUseCasePort, NotionTaskRepositoryPort } from '../ports';
import { Uuid } from '../../../shared/domain/value-objects';
import { Task, TaskRepository } from '../../domain';

@Injectable()
export class ManageTaskUsecase implements ManageTaskUseCasePort {
  private readonly logger = new Logger(ManageTaskUsecase.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notionTaskService: NotionTaskRepositoryPort,
  ) {}

  async syncTask(taskId: Uuid): Promise<void> {
    const task = await this.notionTaskService.fetchById(taskId);

    if (task.isDone()) {
      await this.taskRepository.remove(task);
      return;
    }

    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      await this.taskRepository.insert(task);
      return;
    }

    const updateTask = Task.create(task);
    // keep state from a prev task if exists
    updateTask.notificationStages = existingTask.notificationStages;
    updateTask.notifiedAt = existingTask.notifiedAt;

    await this.taskRepository.update(updateTask);
  }

  async removeTask(taskId: Uuid): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    await this.taskRepository.remove(task);
  }
}
