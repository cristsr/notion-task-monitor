import { Task } from '../../../domain';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Uuid } from '../../../../shared/domain/value-objects';

export class NotionTaskMapper {
  static toDomain(notionTask: PageObjectResponse): Task {
    return Task.create({
      id: Uuid.create(notionTask.id),
      title: notionTask.properties.Name['title'][0].plain_text,
      status: notionTask.properties['📊 Status']['status'].name,
      assignedTo: '',
      createdAt: undefined,
      createdBy: '',
      date: undefined,
      notified: false,
      priority: undefined,
      type: undefined,
    });
  }
}
