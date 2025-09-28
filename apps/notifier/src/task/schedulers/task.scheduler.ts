import { Injectable, Logger } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskScheduler {
  private readonly logger = new Logger(TaskScheduler.name);

  constructor(private readonly appService: TaskService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async notify(): Promise<void> {
    this.logger.log('Notification scheduler started');
    await this.appService.notifyTask();
  }
}
