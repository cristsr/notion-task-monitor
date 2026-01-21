import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  constructor() {}

  @Get()
  healthcheck() {
    return {
      status: 'ok',
    };
  }
}
