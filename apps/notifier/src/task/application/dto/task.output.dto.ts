import {
  NotificationStage,
  TaskPriority,
  TaskStatus,
  TaskType,
} from '../../domain';
import { IsDateString, IsIn, IsString, IsUUID } from 'class-validator';
import { Optional } from '@nestjs/common';

export class TaskOutput {
  @IsUUID('4')
  id: string;

  @IsString()
  title: string;

  @IsDateString()
  date: string;

  @IsString()
  assignedTo: string;

  @IsDateString()
  createdAt: string;

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
  @Optional()
  notifiedAt?: string;

  url: string;

  constructor(payload: TaskOutput) {
    Object.assign(this, payload);
  }
}
