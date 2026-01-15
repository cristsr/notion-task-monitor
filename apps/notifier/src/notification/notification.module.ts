import { Module, ValidationPipe } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Client as DiscordClient } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { discordClientFactory } from './infrastructure/factories';
import { notifierProviderFactory } from './infrastructure/factories/notifier-provider.factory';
import {
  DiscordNotifierService,
  PushoverNotifierService,
} from './infrastructure/adapters/output';
import { NotificationsController } from './infrastructure/adapters/input';
import { NOTIFIERS } from './application/ports/output';
import { NotificationService } from './application/services';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    DiscordNotifierService,
    PushoverNotifierService,
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
    {
      provide: NOTIFIERS,
      useFactory: notifierProviderFactory(),
      inject: [DiscordNotifierService, PushoverNotifierService],
    },
    {
      provide: DiscordClient,
      useFactory: discordClientFactory(),
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
