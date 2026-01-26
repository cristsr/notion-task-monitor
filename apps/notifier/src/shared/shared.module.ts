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
import { HealthcheckController } from './infrastructure/adapters';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import {
  MongodbConnection,
  MongodbConnectionFactory,
} from './infrastructure/config/mongodb';
import { Connection } from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      // connectionName: 'default',
      useFactory: MongodbConnectionFactory.create(),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthcheckController],
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
    {
      provide: MongodbConnection,
      useFactory: (conn: Connection) => conn,
      inject: [getConnectionToken()],
    },
  ],
  exports: [NotionClient, Cache, LokidbConnection],
})
export class SharedModule {}
