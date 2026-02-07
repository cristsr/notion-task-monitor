import { Injectable, Logger } from '@nestjs/common';
import { Uuid } from '../../../shared/domain/value-objects';
import { TaskRepository } from '../../domain';

@Injectable()
export class RemoveTaskUsecase {
  private readonly logger = new Logger(RemoveTaskUsecase.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: Uuid): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    await this.taskRepository.remove(task);
  }
}
