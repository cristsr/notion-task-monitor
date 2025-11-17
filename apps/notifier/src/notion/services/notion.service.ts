import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { filter, from, map, retry, switchMap, toArray } from 'rxjs';
import { NotionRepository } from '../repositories/notion.repository';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { isValidNotionPage, Page } from '../dto/notion.dto';
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
        retry(3),
        switchMap((res) => from(res.results)),
        filter((page: PageObjectResponse) => isValidNotionPage(page)),
        map((page: PageObjectResponse) => Page.fromNotionPage(page)),
        toArray(),
        map((items) => items.toSorted((a, b) => a.compare(b))),
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
