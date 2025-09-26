import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { Page } from '../dto/notion.dto';
import { DateTime } from 'luxon';

@Injectable()
export class NotionRepository {
  constructor(private cache: Cache) {}

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

    const now = DateTime.local({ zone: 'America/Bogota' }).set({
      second: 0,
      millisecond: 0,
    });

    return pages.find((page) => {
      const startDate = DateTime.fromISO(page.startDate);

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
