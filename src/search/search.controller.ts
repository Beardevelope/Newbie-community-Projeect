import { Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async search(@Query() string, @Req() req) {
        const { text, page, order, filter, tagName, tab } = req.query;
        const result = await this.searchService.search(text, +page, order, filter, tagName, tab);
        return result;
    }
}
