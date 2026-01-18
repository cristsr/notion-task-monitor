import { TaskOutput } from '../dto';
import { Task } from '../../domain';

export class TaskMapper {
  static toDTO(task: Task): TaskOutput {
    return new TaskOutput({
      id: task.id.value,
      title: task.title,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt,
      createdBy: task.createdBy,
      date: task.date,
      notified: task.notified,
      priority: task.priority,
      status: task.status,
      type: task.type,
    });
  }
}
