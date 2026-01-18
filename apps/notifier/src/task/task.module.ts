import { Module } from '@nestjs/common';
import { NotionModule } from '../notion/notion.module';
import { NotificationModule } from '../notification/notification.module';
import { LokidbConnection } from '../shared/infrastructure/config/lokidb';
import {
  LokidbTaskCollection,
  LokidbTaskRepository,
} from './infrastructure/adapters/persistence/lokidb';
import { TaskController } from './infrastructure/adapters/http';
import { TaskScheduler } from './infrastructure/adapters/schedulers';
import { NotionTaskService } from './infrastructure/adapters/notion';
import {
  NotifyTaskUsecase,
  RetrieveTaskUsecase,
  SyncTaskUsecase,
} from './application/usecases';
import {
  NotionTaskServicePort,
  RetrieveTaskUsecasePort,
  SyncTaskUsecasePort,
} from './application/ports';
import { TaskRepository } from './domain';

@Module({
  imports: [NotificationModule, NotionModule],
  controllers: [TaskController],
  providers: [
    NotifyTaskUsecase,
    TaskScheduler,
    {
      provide: RetrieveTaskUsecasePort,
      useClass: RetrieveTaskUsecase,
    },
    {
      provide: SyncTaskUsecasePort,
      useClass: SyncTaskUsecase,
    },
    {
      provide: NotionTaskServicePort,
      useClass: NotionTaskService,
    },
    {
      provide: TaskRepository,
      useClass: LokidbTaskRepository,
    },
    {
      provide: LokidbTaskCollection,
      useFactory: (conn: LokidbConnection) => conn.addCollection('tasks'),
      inject: [LokidbConnection],
    },
  ],
})
export class TaskModule {}
