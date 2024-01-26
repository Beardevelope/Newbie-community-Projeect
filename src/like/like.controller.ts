import { Controller, Get, Post, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':projectPostId')
    create(@Param('projectPostId') projectPostId: string, @Req() req) {
        return this.likeService.create(+projectPostId, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Get()
    findAll(@Req() req) {
        return this.likeService.findAll(+req.userId);
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
