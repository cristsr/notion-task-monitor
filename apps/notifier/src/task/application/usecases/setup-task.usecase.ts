import { Injectable } from '@nestjs/common';
import { TaskProviderPort } from '../ports';
import { TaskRepository } from '../../domain';

@Injectable()
export class SetupTaskUsecase {
  constructor(
    private readonly taskProvider: TaskProviderPort,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.taskProvider.fetchAll();

    for (const task of tasks) {
      const existingTask = await this.taskRepository.findById(task.id);

      if (!existingTask) {
        await this.taskRepository.insert(task);
        continue;
      }

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
}
