import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { PaginationDto } from './dto/paginationDto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('project-post')
export class ProjectPostController {
    constructor(private readonly projectPostService: ProjectPostService) {}

    @UseGuards(BearerTokenGuard)
    @Post()
    create(@Body() createProjectPostDto: CreateProjectPostDto, @Req() req) {
        return this.projectPostService.create(createProjectPostDto, +req.userId);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.projectPostService.findAll(paginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectPostService.findOne(+id);
    }

    @UseGuards(BearerTokenGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProjectPostDto: UpdateProjectPostDto,
        @Req() req,
    ) {
        return this.projectPostService.update(+id, updateProjectPostDto, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.projectPostService.remove(+id, +req.userId);
    }

    @Patch(':id/increaseHitCount')
    increaseHitCount(@Param('id') id: string) {
        return this.projectPostService.increaseHitCount(+id);
    }

    @UseGuards(BearerTokenGuard)
    @Post(':id/projectApplicant')
    createProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.createProjectApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Get(':id/projectApplicant')
    findProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.findProjectApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete(':id/ProjectApplicant')
    removeProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.removeProjectApplicant(+id, +req.userId);
    }
}
