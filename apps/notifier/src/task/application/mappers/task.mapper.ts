import { TaskOutput } from '../dto';
import { Task } from '../../domain';

export class TaskMapper {
  static toDTO(task: Task): TaskOutput {
    return new TaskOutput({
      id: task.id.value,
      title: task.title,
      assignedTo: task.assignedTo,
      createdAt: task.createdAt.toISO(),
      createdBy: task.createdBy,
      date: task.date.toISO(),
      priority: task.priority,
      status: task.status,
      type: task.type,
      notificationStages: task.notificationStages,
      notifiedAt: task.notifiedAt?.toISO(),
    });
  }
}
