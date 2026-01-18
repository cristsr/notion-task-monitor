import { TaskPriority, TaskStatus, TaskType } from '../../domain';
import { IsDate, IsIn, IsString, IsUUID } from 'class-validator';

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

  notified: boolean;

  @IsString()
  @IsIn(Object.values(TaskPriority))
  priority: TaskPriority;

  @IsString()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsString()
  @IsIn(Object.values(TaskType))
  type: TaskType;
}
