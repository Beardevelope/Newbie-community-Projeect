import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

    // 태그 조회
    @Get()
    async findTagAll(@Query() query: string, @Req() req) {
        const { order } = req.query;
        const tags = await this.tagService.findTagAll(order);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            tags,
        };
    }
}
