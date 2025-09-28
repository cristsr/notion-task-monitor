import { Module } from '@nestjs/common';
import { NotionController } from './controllers/notion.controller';
import { NotionService } from './services/notion.service';
import { NotionScheduler } from './schedulers/notion.scheduler';
import { NotionRepository } from './repositories/notion.repository';
import { Client, LogLevel } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { NOTION_CLIENT } from './constants';

@Module({
  imports: [],
  controllers: [NotionController],
  providers: [
    NotionService,
    NotionRepository,
    NotionScheduler,
    {
      provide: NOTION_CLIENT,
      useFactory: (config: ConfigService) => {
        return new Client({
          auth: config.get('NOTION_TOKEN'),
          logLevel: LogLevel.ERROR,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotionService],
})
export class NotionModule {}
