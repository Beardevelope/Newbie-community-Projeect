import { Controller, Get, Post, Put, Query } from '@nestjs/common';
import { SearchService } from './search.service';


@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('text') text: string) {
    const result = await this.searchService.search(text);
    return result;
  }
}