import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Post(':projectPostId')
    create(@Param('projectPostId') projectPostId: string) {
        return this.likeService.create(+projectPostId);
    }

    @Get()
    findAll() {
        return this.likeService.findAll();
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
