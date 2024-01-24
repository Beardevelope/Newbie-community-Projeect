import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { ProjectApplicant } from './entities/projectApplicant.entity';

@Controller('project-post')
export class ProjectPostController {
    constructor(private readonly projectPostService: ProjectPostService) {}

    @Post()
    create(@Body() createProjectPostDto: CreateProjectPostDto) {
        return this.projectPostService.create(createProjectPostDto);
    }

    @Get()
    findAll() {
        return this.projectPostService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectPostService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectPostDto: UpdateProjectPostDto) {
        return this.projectPostService.update(+id, updateProjectPostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectPostService.remove(+id);
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
