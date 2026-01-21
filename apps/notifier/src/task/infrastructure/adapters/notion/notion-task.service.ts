import { Injectable, Logger } from '@nestjs/common';
import { NotionTaskServicePort } from '../../../application/ports';
import { NotionClient } from '../../../../shared/infrastructure/config/notion';
import { ConfigService } from '@nestjs/config';
import {
  catchError,
  defer,
  EMPTY,
  expand,
  from,
  lastValueFrom,
  map,
  reduce,
  retry,
  takeWhile,
} from 'rxjs';
import { NotionTaskMapper } from './notion-task.mapper';
import { Task } from '../../../domain';

@Injectable()
export class NotionTaskService implements NotionTaskServicePort {
  private readonly logger = new Logger(NotionTaskService.name);
  constructor(
    private readonly notionClient: NotionClient,
    private readonly config: ConfigService,
  ) {}

  async execute(): Promise<Task[]> {
    const source = defer(() => this.queryTasks()).pipe(
      expand((state) => {
        if (!state.hasMore) return EMPTY;
        return this.queryTasks(state.cursor);
      }),
      takeWhile((state) => state.hasMore, true),
      map((state) => state.results),
      reduce((acc, results) => [...acc, ...results], []),
      map((results) => results.map(NotionTaskMapper.toDomain)),
    );

    return await lastValueFrom(source);
  }

  private queryTasks(cursor?: string) {
    return from(
      this.notionClient.databases.query({
        database_id: this.config.get('TASK_DATABASE_ID'),
        filter: {
          and: [
            {
              property: '📊 Status',
              status: {
                equals: 'Not started',
              },
            },
            {
              property: '📅 Date',
              date: {
                is_not_empty: true,
              },
            },
          ],
        },
        start_cursor: cursor,
      }),
    ).pipe(
      retry({
        count: 3,
        delay: 1000,
        resetOnSuccess: true,
      }),
      map((response) => ({
        cursor: response.next_cursor,
        hasMore: response.has_more,
        results: response.results,
      })),
      catchError((err) => {
        this.logger.warn('Failed to retrieve tasks from notion', {
          cursor,
          message: err.message,
        });

        return EMPTY;
      }),
    );
  }
}
