import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationService } from './services/notification.service';
import { APP_PIPE } from '@nestjs/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { NOTIFICATION_STRATEGIES } from './constants';
import {
  NotificationProviders,
  NotificationStrategy,
} from './services/strategies';
import { Client, Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    ...NotificationProviders,
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
      provide: NOTIFICATION_STRATEGIES,
      useFactory: (...providers: NotificationStrategy[]) => {
        return new Map<string, NotificationStrategy>(
          providers.map((p) => [p.instance, p]),
        );
      },
      inject: NotificationProviders,
    },
    {
      provide: DiscordClient,
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('DiscordClientProvider');
        const token = config.get('DISCORD_BOT_TOKEN');

        const client = new Client({
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });

        client.on('clientReady', () => {
          logger.log(`Discord bot logged in as ${client.user?.tag}`);
        });

        client.on('error', (error) => {
          logger.error('Discord client error:', error);
        });

        try {
          await client.login(token);
          logger.log('Discord bot initialized successfully');
        } catch (error) {
          logger.error('Failed to login to Discord:', error);
        }

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
