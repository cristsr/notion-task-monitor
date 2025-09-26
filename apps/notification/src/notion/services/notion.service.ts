import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { NOTION_CLIENT } from '../../app/constants';
import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { catchError, from, map, switchMap, tap, toArray } from 'rxjs';
import { NotionRepository } from '../repositories/notion.repository';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Page } from '../dto/notion.dto';

@Injectable()
export class NotionService implements OnModuleInit {
  private logger = new Logger('NotionService');
  constructor(
    @Inject(NOTION_CLIENT)
    private readonly notionClient: Client,
    private readonly config: ConfigService,
    private readonly notionRepository: NotionRepository,
  ) {}

  onModuleInit(): void {
    this.getDatabaseItems().subscribe({});
  }

  getDatabaseItems() {
    return from(
      this.notionClient.databases.query({
        database_id: this.config.get('DATABASE_ID'),
      }),
    ).pipe(
      catchError((err) => {
        this.logger.error(`Failed to retrieve database from notion`);
        this.logger.error(err.status);
        this.logger.error(err.message);
        throw new HttpException(err.message, err.status);
      }),
      switchMap((res) => from(res.results)),
      map(
        (page: PageObjectResponse) =>
          new Page({
            id: page.id,
            title: page.properties['Habits']['title'][0].plain_text,
            startDate: page.properties['Start Date']['date'].start,
            endDate: page.properties['End Date']['date'].start,
            done: page.properties['Done']['checkbox'],
            url: page.url,
          }),
      ),
      toArray(),
      map((items) =>
        items.sort((a, b) => a.startDate.localeCompare(b.startDate)),
      ),
      tap((items) => this.notionRepository.setPages(items)),
    );
  }

  getNextPage() {
    return this.notionRepository.getNextItem();
  }
}
