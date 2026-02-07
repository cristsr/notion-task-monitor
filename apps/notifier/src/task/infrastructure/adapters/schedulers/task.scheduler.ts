import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  NotifyTaskUsecase,
  VisibilityTaskUsecase,
} from '../../../application/usecases';

@Injectable()
export class TaskScheduler {
  constructor(
    private readonly notifyTaskUsecase: NotifyTaskUsecase,
    private readonly visibilityTaskUsecase: VisibilityTaskUsecase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async notifyTasks(): Promise<void> {
    await this.notifyTaskUsecase.execute();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async verifyTaskVisibility(): Promise<void> {
    await this.visibilityTaskUsecase.execute();
  }
}
