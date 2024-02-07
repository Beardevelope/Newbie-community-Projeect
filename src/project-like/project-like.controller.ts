import { Controller, Get, Post, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProjectLikeService } from './project-like.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('project-like')
export class ProjectLikeController {
    constructor(private readonly projectLikeService: ProjectLikeService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':projectPostId')
    create(@Param('projectPostId') projectPostId: string, @Req() req) {
        return this.projectLikeService.create(+projectPostId, +req.userId);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.projectLikeService.findAll(+projectPostId);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myLike')
    findAllUser(@Req() req) {
        return this.projectLikeService.findAllUser(+req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myLike/:id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.projectLikeService.findOne(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete(':projectPostId')
    remove(@Param('projectPostId') projectPostId: string, @Req() req) {
        return this.projectLikeService.remove(+projectPostId, +req.userId);
    }
}
