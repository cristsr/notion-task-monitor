import { Controller, Get, Logger } from '@nestjs/common';
import {
  NotifyTaskUsecase,
  RetrieveTaskUsecase,
  SetupTaskUsecase,
} from '../../../application/usecases';

@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(
    private readonly notifyTaskUsecase: NotifyTaskUsecase,
    private readonly retrieveTaskUsecase: RetrieveTaskUsecase,
    private readonly syncTaskUsecase: SetupTaskUsecase,
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
