import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { APP_PIPE } from '@nestjs/core';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '../notifications/notification.module';
import { HttpModule } from '@nestjs/axios';
import { NotionModule } from '../notion/notion.module';
import { AppScheduler } from './schedulers/app.scheduler';
import { ScheduleModule } from '@nestjs/schedule';

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
    NotificationModule,
    NotionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppScheduler,
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
