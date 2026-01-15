import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { NotifierServicePort } from '../../../../application/ports/output';
import { NotifierTypes } from '../../../../application/types';

@Injectable()
export class DiscordNotifierService implements NotifierServicePort {
  readonly instance = NotifierTypes.DISCORD;
  private readonly logger = new Logger(DiscordNotifierService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly client: Client,
  ) {}

  /**
   * Notify to discord
   * @param payload
   */
  async notify(payload: any): Promise<void> {
    if (!this.client.isReady()) {
      this.logger.warn('Discord bot is not ready yet');
      return;
    }

    const channelId = this.config.get('DISCORD_CHANNEL_ID');
    const thumbnail = this.config.get('DISCORD_THUMBNAIL_URL');

    if (!channelId) {
      this.logger.error('Discord channel ID is not configured');
      return;
    }

    try {
      const channel = await this.client.channels.fetch(channelId);

      if (!channel || !(channel instanceof TextChannel)) {
        this.logger.error('Invalid channel or not a text channel');
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(payload.title)
        .setDescription(payload.message.trim())
        .setColor('#f2e558')
        .setTimestamp()
        .setAuthor({
          name: 'Notifier',
        })
        .setThumbnail(thumbnail)
        .setFooter({
          text: `Notifier`,
        })
        .setTimestamp();

      if (payload.url) {
        embed.setURL(payload.url);
      }

      await channel.send({ embeds: [embed] });
      this.logger.log('Discord notification sent successfully');
    } catch (error) {
      this.logger.error('Failed to send Discord notification:', error);
    }
  }
}
