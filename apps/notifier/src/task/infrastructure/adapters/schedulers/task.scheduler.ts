import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  NotifyTaskUseCasePort,
  SyncTaskUsecasePort,
} from '../../../application/ports';

@Injectable()
export class TaskScheduler implements OnModuleInit {
  constructor(
    private readonly syncTaskUsecase: SyncTaskUsecasePort,
    private readonly notifyTaskUsecase: NotifyTaskUseCasePort,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncTaskUsecase.execute();
    await this.notifyTaskUsecase.execute();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncTasks(): Promise<void> {
    await this.syncTaskUsecase.execute();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async notifyTasks(): Promise<void> {
    await this.notifyTaskUsecase.execute();
  }
}
