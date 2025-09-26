import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('task')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('notify')
  notifyTask() {
    this.logger.log('Attempting to notify!');
    return this.appService.notifyTask();
  }
}
