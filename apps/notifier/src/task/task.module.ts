import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { LokidbTaskEntityProvider } from './infrastructure/adapters/persistence/lokidb/task';
import { TaskController } from './infrastructure/adapters/http';
import { TaskScheduler } from './infrastructure/adapters/schedulers';
import { NotionTaskRepository } from './infrastructure/adapters/notion';
import {
  NotifyTaskUsecase,
  RetrieveTaskUsecase,
  SyncTaskUsecase,
} from './application/usecases';
import {
  ManageTaskUseCasePort,
  NotifyTaskUseCasePort,
  NotionTaskRepositoryPort,
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
import { TaskEvent } from './infrastructure/adapters/events';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([MongodbTaskEntityProvider]),
  ],
  controllers: [TaskController],
  providers: [
    LokidbTaskEntityProvider,
    TaskScheduler,
    TaskEvent,
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
      provide: NotionTaskRepositoryPort,
      useClass: NotionTaskRepository,
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
