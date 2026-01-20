import { Controller, Get, Logger } from '@nestjs/common';
import {
  NotifyTaskUseCasePort,
  RetrieveTaskUsecasePort,
  SyncTaskUsecasePort,
} from '../../../application/ports';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(
    private readonly notifyTaskUsecase: NotifyTaskUseCasePort,
    private readonly retrieveTaskUsecase: RetrieveTaskUsecasePort,
    private readonly syncTaskUsecase: SyncTaskUsecasePort,
  ) {}

  @Get()
  getTasks() {
    return this.retrieveTaskUsecase.execute();
  }

  @Get('sync')
  syncTasks() {
    return this.syncTaskUsecase.execute();
  }

  @Get('notify')
  notifyTask() {
    return this.notifyTaskUsecase.execute();
  }
}
