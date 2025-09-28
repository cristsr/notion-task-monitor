import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { from, map, switchMap, toArray } from 'rxjs';
import { NotionRepository } from '../repositories/notion.repository';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Page } from '../dto/notion.dto';
import { NOTION_CLIENT } from '../constants';

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
    this.fetchPages();
  }

  fetchPages(): void {
    this.logger.log(`Starting to fetch pages from notion`);

    from(
      this.notionClient.databases.query({
        database_id: this.config.get('DATABASE_ID'),
      }),
    )
      .pipe(
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
      )
      .subscribe({
        next: (items) => {
          this.notionRepository.setPages(items).then();
          this.logger.log(`Successfully fetched pages from notion`);
        },
        error: (err) => {
          this.logger.error(`Failed to retrieve database from notion`);
          this.logger.error(err.status);
          this.logger.error(err.message);
        },
      });
  }

  getPages() {
    return this.notionRepository.getPages();
  }

  getNextPage() {
    return this.notionRepository.getNextPage();
  }

  getNextPageOrFail() {
    return this.notionRepository.getNextPageOrFail();
  }
}
