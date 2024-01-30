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

    @Get(':id')
    findAll(@Param('id') id: string) {
        return this.likeService.findAll(+id);
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

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.likeService.remove(+id);
    }
}
