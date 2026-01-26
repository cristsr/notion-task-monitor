import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { LokidbTaskEntityProvider } from './infrastructure/adapters/persistence/lokidb/task';
import { TaskController } from './infrastructure/adapters/http';
import { TaskScheduler } from './infrastructure/adapters/schedulers';
import { NotionTaskService } from './infrastructure/adapters/notion';
import {
  NotifyTaskUsecase,
  RetrieveTaskUsecase,
  SyncTaskUsecase,
} from './application/usecases';
import {
  ManageTaskUseCasePort,
  NotifyTaskUseCasePort,
  NotionTaskServicePort,
  RetrieveTaskUsecasePort,
  SyncTaskUsecasePort,
} from './application/ports';
import { TaskRepository } from './domain';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongodbTaskEntityProvider,
  MongodbTaskRepository,
} from './infrastructure/adapters/persistence/mongodb/task';
import { ManageTaskUsecase } from './application/usecases/manage-task.usecase';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([MongodbTaskEntityProvider]),
  ],
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
      useClass: MongodbTaskRepository,
    },
    {
      provide: ManageTaskUseCasePort,
      useClass: ManageTaskUsecase,
    },
  ],
})
export class TaskModule {}
