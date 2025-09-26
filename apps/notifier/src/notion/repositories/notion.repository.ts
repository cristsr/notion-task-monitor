import { Injectable, Logger } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { Page } from '../dto/notion.dto';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotionRepository {
  private readonly logger = new Logger(NotionRepository.name);

  constructor(
    private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {}

  async setPages(data: Page[]): Promise<void> {
    await this.cache.set('pages', data);
  }

  async getPages(): Promise<Page[]> {
    const pages = await this.cache.get<Page[]>('pages');
    return !pages?.length ? [] : pages;
  }

  async getNextItem() {
    const pages = await this.getPages();

    if (!pages?.length) {
      return;
    }

    const zone = this.config.get('TIME_ZONE');

    const now = DateTime.local({ zone }).set({
      second: 0,
      millisecond: 0,
    });

    this.logger.log(`Attempting to notify at ${now.toISO()}`);

    return pages.find((page) => {
      const startDate = DateTime.fromISO(page.startDate).setZone(zone);

      const minus = startDate.minute - 0;

      const dateMinusFive = startDate.set({
        minute: minus,
        second: 0,
        millisecond: 0,
      });

      return now.toISO() === dateMinusFive.toISO();
    });
  }
}
