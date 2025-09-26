import { Module } from '@nestjs/common';
import { NotionController } from './controllers/notion.controller';
import { NotionService } from './services/notion.service';
import { NotionRepository } from './repositories/notion.repository';
import { NOTION_CLIENT } from '../app/constants';
import { Client, LogLevel } from '@notionhq/client';

@Module({
  imports: [],
  controllers: [NotionController],
  providers: [
    NotionService,
    NotionRepository,
    {
      provide: NOTION_CLIENT,
      useValue: new Client({
        auth: process.env.NOTION_TOKEN,
        logLevel: LogLevel.ERROR,
      }),
    },
  ],
  exports: [NotionService],
})
export class NotionModule {}
