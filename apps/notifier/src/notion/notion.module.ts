import { Module } from '@nestjs/common';
import { NotionController } from './controllers/notion.controller';
import { NotionService } from './services/notion.service';
import { NotionScheduler } from './schedulers/notion.scheduler';
import { NotionRepository } from './repositories/notion.repository';
import { NOTION_CLIENT } from '../app/constants';
import { Client, LogLevel } from '@notionhq/client';
import { ConfigService } from '@nestjs/config';
import { not } from 'rxjs/internal/util/not';

@Module({
  imports: [],
  controllers: [NotionController],
  providers: [
    NotionService,
    NotionRepository,
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
