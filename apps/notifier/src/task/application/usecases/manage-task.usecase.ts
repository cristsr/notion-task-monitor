import { Injectable } from '@nestjs/common';
import { ManageTaskUseCasePort, NotionTaskRepositoryPort } from '../ports';
import { Uuid } from '../../../shared/domain/value-objects';
import { TaskRepository } from '../../domain';

@Injectable()
export class ManageTaskUsecase implements ManageTaskUseCasePort {
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

    const newTask = existingTask ? Object.assign(existingTask, task) : task;

    await this.taskRepository.save(newTask);
  }

  async removeTask(taskId: Uuid): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    await this.taskRepository.remove(task);
  }
}
