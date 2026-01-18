import { TaskPriority, TaskStatus, TaskType } from '../../domain';
import { IsDate, IsIn, IsString, IsUUID } from 'class-validator';

export class TaskOutput {
  @IsUUID('4')
  id: string;

  @IsString()
  title: string;

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

  constructor(payload: Partial<TaskOutput>) {
    Object.assign(this, payload);
  }
}
