import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import {
  NotionEventInput,
  NotionEventType,
} from '../../../../shared/infrastructure/dtos';
import { Uuid } from '../../../../shared/domain/value-objects';
import {
  RemoveTaskUsecase,
  SyncTaskUsecase,
} from '../../../application/usecases';

@Injectable()
export class EventTaskService {
  private readonly logger = new Logger(EventTaskService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly synctTaskUsecase: SyncTaskUsecase,
    private readonly removeTasksUsecase: RemoveTaskUsecase,
  ) {}

  @OnEvent('notion.event')
  async onNotionEvent(event: NotionEventInput) {
    const notionDatasource = this.configService.get('NOTION_TASK_DATASOURCE');

    if (event.data.parent.data_source_id !== notionDatasource) return;

    const eventHandlers = {
      [NotionEventType.PAGE_CREATED]: () =>
        this.synctTaskUsecase.execute(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_PROPERTIES_UPDATED]: () =>
        this.synctTaskUsecase.execute(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_UNDELETED]: () =>
        this.synctTaskUsecase.execute(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_DELETED]: () =>
        this.removeTasksUsecase.execute(Uuid.create(event.entity.id)),
    };

    const handler = eventHandlers[event.type];

    if (!handler) {
      //
      this.logger.warn(`No handler found for event type: ${event.type}`);
      return;
    }

    try {
      await handler();
    } catch (e) {
      this.logger.error(`Failed to handle event: ${event.type}`, {
        message: e.message,
      });
    }
  }
}
