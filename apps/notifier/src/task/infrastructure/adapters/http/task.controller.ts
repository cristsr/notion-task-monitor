import { Controller, Get, Logger } from '@nestjs/common';
import { NotifyTaskUsecase } from '../../../application/usecases';
import { RetrieveTaskUsecasePort } from '../../../application/ports';
import { SyncTaskUsecasePort } from '../../../application/ports/sync-task.usecase.port';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(
    private readonly appService: NotifyTaskUsecase,
    private readonly retrieveTaskService: RetrieveTaskUsecasePort,
    private readonly syncTaskService: SyncTaskUsecasePort,
  ) {}

  @Get()
  getTasks() {
    return this.retrieveTaskService.execute();
  }

  @Get('sync')
  syncTasks() {
    return this.syncTaskService.execute();
  }

  @Get('notify')
  notifyTask() {
    return this.appService.notifyTask();
  }
}
