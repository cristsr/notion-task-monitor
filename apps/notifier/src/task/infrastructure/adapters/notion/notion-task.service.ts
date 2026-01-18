import { Injectable } from '@nestjs/common';
import { NotionTaskServicePort } from '../../../application/ports';
import { NotionClient } from '../../../../shared/infrastructure/config/notion';
import { ConfigService } from '@nestjs/config';
import {
  defer,
  EMPTY,
  expand,
  from,
  lastValueFrom,
  map,
  reduce,
  takeWhile,
} from 'rxjs';
import { NotionTaskMapper } from './notion-task.mapper';
import { Task } from '../../../domain';

@Injectable()
export class NotionTaskService implements NotionTaskServicePort {
  constructor(
    private readonly notionClient: NotionClient,
    private readonly config: ConfigService,
  ) {}

  async fetchTasks(): Promise<Task[]> {
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
          ],
        },
        start_cursor: cursor,
      }),
    ).pipe(
      map((response) => ({
        cursor: response.next_cursor,
        hasMore: response.has_more,
        results: response.results,
      })),
    );
  }
}
