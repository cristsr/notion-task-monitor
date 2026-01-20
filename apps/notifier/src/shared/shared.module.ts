import { Global, Module } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  NotionClient,
  NotionClientFactory,
} from './infrastructure/config/notion';
import {
  LokidbConnection,
  LokidbConnectionFactory,
} from './infrastructure/config/lokidb';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: Cache,
      useExisting: CACHE_MANAGER,
    },
    {
      provide: NotionClient,
      useFactory: NotionClientFactory.getClient(),
      inject: [ConfigService],
    },
    {
      provide: LokidbConnection,
      useFactory: LokidbConnectionFactory.create(),
      inject: [ConfigService],
    },
  ],
  exports: [NotionClient, Cache, LokidbConnection],
})
export class SharedModule {}
