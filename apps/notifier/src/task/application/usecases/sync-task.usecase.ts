import { Injectable } from '@nestjs/common';
import { NotionTaskServicePort, SyncTaskUsecasePort } from '../ports';
import { Task, TaskRepository } from '../../domain';

@Injectable()
export class SyncTaskUsecase implements SyncTaskUsecasePort {
  constructor(
    private readonly notionTaskService: NotionTaskServicePort,
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<void> {
    const tasks = await this.notionTaskService.fetchTasks();

    await this.removeObsoleteTasks(tasks);

    await this.updateOrCreateTasks(tasks);
  }

  private async removeObsoleteTasks(tasks: Task[]): Promise<void> {
    const existingTasks = await this.taskRepository.getAllTask();

    const tasksToRemove = existingTasks.filter(
      (exist) => !tasks.some((task) => task.id.equals(exist.id)),
    );

    for (const task of tasksToRemove) {
      await this.taskRepository.remove(task);
    }
  }

  private async updateOrCreateTasks(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      const existingTask = await this.taskRepository.findById(task.id.value);

      if (!existingTask || !task.equals(existingTask)) {
        await this.taskRepository.save(task);
      }
    }
  }
}
