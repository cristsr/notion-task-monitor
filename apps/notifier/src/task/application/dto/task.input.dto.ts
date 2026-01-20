import {
  NotificationStage,
  TaskPriority,
  TaskStatus,
  TaskType,
} from '../../domain';
import { IsDate, IsDateString, IsIn, IsString, IsUUID } from 'class-validator';

export class TaskInput {
  @IsUUID('4')
  id: string;

  @IsDate()
  date: Date;

  @IsString()
  assignedTo: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  createdBy: string;

  @IsString()
  @IsIn(Object.values(TaskPriority))
  priority: TaskPriority;

  @IsString()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsString()
  @IsIn(Object.values(TaskType))
  type: TaskType;

  @IsIn(Object.values(NotificationStage), { each: true })
  notificationStages: NotificationStage[];

  @IsDateString()
  notifiedAt: string;
}
