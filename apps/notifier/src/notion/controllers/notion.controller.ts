import { Controller, Get } from '@nestjs/common';
import { NotionService } from '../services/notion.service';
import { Page } from '../dto/notion.dto';

@Controller('notion')
export class NotionController {
  constructor(private readonly appService: NotionService) {}

  @Get('pages')
  getPages(): Promise<Page[]> {
    return this.appService.getPages();
  }

  @Get('pages/sync')
  syncPages(): void {
    return this.appService.fetchPages();
  }

  @Get('pages/next')
  getNextPage(): Promise<Page> {
    return this.appService.getNextPageOrFail();
  }
}
