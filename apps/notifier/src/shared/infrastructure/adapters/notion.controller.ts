import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter } from '../config/events';
import { NotionEventInput } from '../dtos';

@Controller('notion')
export class NotionController {
  constructor(private readonly eventEmitter: EventEmitter) {}

  @Post('events')
  onEvent(@Body() event: NotionEventInput) {
    this.eventEmitter.emit('notion.event', event);
  }
}
