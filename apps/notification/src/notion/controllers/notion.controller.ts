import { Controller, Get } from '@nestjs/common';
import { NotionService } from '../services/notion.service';

@Controller('notion')
export class NotionController {
  constructor(private readonly appService: NotionService) {}

  @Get('pages')
  getPages() {
    return this.appService.getDatabaseItems();
  }

  @Get('next')
  getNextPage() {
    return this.appService.getNextPage();
  }
}
