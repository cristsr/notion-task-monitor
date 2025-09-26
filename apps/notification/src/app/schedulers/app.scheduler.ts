import { Injectable, Logger } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppScheduler {
  private readonly logger = new Logger(AppScheduler.name);

  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async notify(): Promise<void> {
    this.logger.log('Attempting to notify!');
    await this.appService.notifyTask();
  }
}
