import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RetrieveTaskUsecasePort } from '../../../application/ports';

@Injectable()
export class TaskScheduler implements OnModuleInit {
  constructor(private readonly retrieveTaskService: RetrieveTaskUsecasePort) {}

  onModuleInit(): void {
    this.retrieveTaskService.execute();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async notify(): Promise<void> {
    await this.retrieveTaskService.execute();
  }
}
