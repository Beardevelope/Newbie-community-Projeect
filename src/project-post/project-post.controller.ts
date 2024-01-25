import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { PaginationDto } from './dto/paginationDto';

@Controller('project-post')
export class ProjectPostController {
    constructor(private readonly projectPostService: ProjectPostService) {}

    @Post()
    create(@Body() createProjectPostDto: CreateProjectPostDto, @Req() req) {
        return this.projectPostService.create(createProjectPostDto, req.user.id);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.projectPostService.findAll(paginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectPostService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProjectPostDto: UpdateProjectPostDto,
        @Req() req,
    ) {
        return this.projectPostService.update(+id, updateProjectPostDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.projectPostService.remove(+id, req.user.id);
    }

    @Patch(':id/increaseHitCount')
    increaseHitCount(@Param('id') id: string) {
        return this.projectPostService.increaseHitCount(+id);
    }

    @Post(':id/projectApplicant')
    createProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.createProjectApplicant(+id, req.user.id);
    }

    @Delete(':id/ProjectApplicant')
    removeProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.removeProjectApplicant(+id, req.user.id);
    }
}
