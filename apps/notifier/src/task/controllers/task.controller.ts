import { Controller, Get, Logger } from '@nestjs/common';
import { TaskService } from '../services/task.service';

@Controller('task')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly appService: TaskService) {}

  @Get('notify')
  notifyTask() {
    this.logger.log('~task/notify Attempting to notify task');
    return this.appService.notifyTask();
  }
}
