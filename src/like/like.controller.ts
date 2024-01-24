import { Controller, Get, Post, Param, Delete, Req } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Post(':projectPostId')
    create(@Param('projectPostId') projectPostId: string, @Req() req) {
        return this.likeService.create(+projectPostId, req.user.id);
    }

    @Get()
    findAll(@Req() req) {
        return this.likeService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.likeService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.likeService.remove(+id);
    }
}
