import { Injectable } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskScheduler {
  constructor(private readonly appService: TaskService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async notify(): Promise<void> {
    await this.appService.notifyTask();
  }
}
