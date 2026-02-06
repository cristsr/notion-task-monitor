import { Provider } from '@nestjs/common';
import { LokidbTaskCollection } from './lokidb-task.collection';
import { TaskPriority, TaskStatus, TaskType } from '../../../../../domain';
import { LokidbConnection } from '../../../../../../shared/infrastructure/config/lokidb';

export class LokidbTaskEntity {
  id: string;

  title: string;

  date: string;

  status: TaskStatus;

  priority: TaskPriority;

  type: TaskType;

  assignedTo: string;

  createdBy: string;

  createdAt: string;

  notificationStages: string[];

  notifiedAt: string;

  hidden: boolean;

  url: string;

  constructor(payload: LokidbTaskEntity) {
    Object.assign(this, payload);
  }
}

export const LokidbTaskEntityProvider: Provider = {
  provide: LokidbTaskCollection,
  useFactory: (conn: LokidbConnection) => conn.addCollection('tasks'),
  inject: [LokidbConnection],
};
