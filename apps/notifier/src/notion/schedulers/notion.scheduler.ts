import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotionService } from '../services/notion.service';

@Injectable()
export class NotionScheduler {
  constructor(private readonly notionService: NotionService) {}

  @Cron('0 7 * * *')
  getData() {
    this.notionService.fetchPages();
  }
}
