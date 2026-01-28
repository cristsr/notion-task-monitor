import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventEmitterPort } from '../../../application/ports';
import { NotionEventInput } from '../../dtos';
import { Public } from '../../decorators';

@Controller('notion')
export class NotionController {
  private readonly logger = new Logger(NotionController.name);
  constructor(private readonly eventEmitter: EventEmitterPort) {}

  @Public()
  @Post('webhook')
  onEvent(@Body() event: NotionEventInput) {
    this.logger.log({
      message: 'Notion event received',
      event,
    });

    this.eventEmitter.emit('notion.event', event);
  }
}
