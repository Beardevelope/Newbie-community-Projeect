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

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.likeService.findAll(+projectPostId);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myLike')
    findAllUser(@Req() req) {
        return this.likeService.findAllUser(+req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myLike/:id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.likeService.findOne(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete(':projectPostId')
    remove(@Param('projectPostId') projectPostId: string, @Req() req) {
        return this.likeService.remove(+projectPostId, +req.userId);
    }
}
