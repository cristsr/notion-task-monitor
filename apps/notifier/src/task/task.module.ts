import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import {
  LokidbTaskRepository,
  LokidbTaskEntityProvider,
} from './infrastructure/adapters/persistence/lokidb/task';
import { TaskController } from './infrastructure/adapters/http';
import { TaskScheduler } from './infrastructure/adapters/schedulers';
import { NotionTaskService } from './infrastructure/adapters/notion';
import {
  NotifyTaskUsecase,
  RetrieveTaskUsecase,
  SyncTaskUsecase,
} from './application/usecases';
import {
  NotifyTaskUseCasePort,
  NotionTaskServicePort,
  RetrieveTaskUsecasePort,
  SyncTaskUsecasePort,
} from './application/ports';
import { TaskRepository } from './domain';

@Module({
  imports: [NotificationModule],
  controllers: [TaskController],
  providers: [
    TaskScheduler,
    LokidbTaskEntityProvider,
    {
      provide: NotifyTaskUseCasePort,
      useClass: NotifyTaskUsecase,
    },
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
  ],
})
export class TaskModule {}
