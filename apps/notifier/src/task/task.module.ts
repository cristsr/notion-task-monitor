import { Module } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { NotificationModule } from '../notification/notification.module';
import { NotionModule } from '../notion/notion.module';
import { TaskScheduler } from './schedulers/task.scheduler';

@Module({
  imports: [NotificationModule, NotionModule],
  controllers: [TaskController],
  providers: [TaskService, TaskScheduler],
})
export class TaskModule {}
