import { Injectable } from '@nestjs/common';
import { TaskProviderPort } from '../ports';
import { Uuid } from '../../../shared/domain/value-objects';
import { TaskRepository } from '../../domain';

@Injectable()
export class SyncTaskUsecase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskProvider: TaskProviderPort,
  ) {}

  async execute(taskId: Uuid): Promise<void> {
    const task = await this.taskProvider.fetchById(taskId);

    if (task.isDone()) {
      await this.taskRepository.remove(task);
      return;
    }

    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      await this.taskRepository.insert(task);
      return;
    }

    // Only update props from task provider
    existingTask.update({
      title: task.title,
      date: task.date,
      status: task.status,
      priority: task.priority,
      type: task.type,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      hidden: task.hidden,
      url: task.url,
    });

    await this.taskRepository.update(existingTask);
  }
}
