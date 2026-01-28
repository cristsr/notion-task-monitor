import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import {
  NotionEventInput,
  NotionEventType,
} from '../../../../shared/infrastructure/dtos';
import { ManageTaskUseCasePort } from '../../../application/ports';
import { Uuid } from '../../../../shared/domain/value-objects';

@Injectable()
export class TaskEvent {
  private readonly logger = new Logger(TaskEvent.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly manageTaskUsecase: ManageTaskUseCasePort,
  ) {}

  @OnEvent('notion.event')
  async onNotionEvent(event: NotionEventInput) {
    const notionDatasource = this.configService.get('NOTION_TASK_DATASOURCE');

    if (event.data.parent.data_source_id !== notionDatasource) return;

    const eventHandlers = {
      [NotionEventType.PAGE_CREATED]: () =>
        this.manageTaskUsecase.syncTask(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_PROPERTIES_UPDATED]: () =>
        this.manageTaskUsecase.syncTask(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_UNDELETED]: () =>
        this.manageTaskUsecase.syncTask(Uuid.create(event.entity.id)),

      [NotionEventType.PAGE_DELETED]: () =>
        this.manageTaskUsecase.removeTask(Uuid.create(event.entity.id)),
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
