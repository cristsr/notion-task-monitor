import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { NotionModule } from './notion/notion.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    HttpModule.register({
      global: true,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    NotificationModule,
    NotionModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: Cache,
      useExisting: CACHE_MANAGER,
    },
  ],
})
export class AppModule {}
