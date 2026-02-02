import { Task, TaskStatus, TaskType } from '../../../domain';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Uuid } from '../../../../shared/domain/value-objects';
import { DateTime } from 'luxon';

export class NotionTaskMapper {
  static toDomain(input: PageObjectResponse): Task {
    const typeMap: Record<string, TaskType> = {
      Normal: TaskType.NORMAL,
      Scheduled: TaskType.SCHEDULED,
      Recurrent: TaskType.RECURRENT,
    };

    const StatusMap: Record<string, TaskStatus> = {
      'Not started': TaskStatus.NOT_STARTED,
      'In progress': TaskStatus.IN_PROGRESS,
      Done: TaskStatus.DONE,
    };

    //prettier-ignore
    return Task.create({
      id: Uuid.create(input.id),
      title: input.properties.Name['title'][0].text.content,
      status: StatusMap[input.properties['📊 Status']['status'].name],
      assignedTo: input.properties['👦 Assigned To']['people'][0].person.email,
      createdAt: DateTime.fromISO(input.properties['📅 Created At']['created_time']),
      createdBy: input.properties['👮‍♀️ Created By']['created_by'].person.email,
      date: DateTime.fromISO(input.properties['📅 Date']['date'].start),
      priority: input.properties['🚨 Priority']['select'].name,
      type: typeMap[input.properties['📋 Type']['select'].name],
      url: input.url,
      notificationStages: [],
      notifiedAt: null,
    });
  }
}
