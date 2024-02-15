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
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('project-post')
export class ProjectPostController {
    constructor(private readonly projectPostService: ProjectPostService) {}

    @UseGuards(BearerTokenGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(
        @Body() createProjectPostDto: CreateProjectPostDto,
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.projectPostService.create(createProjectPostDto, +req.userId, file);
    }

    @Get()
    findAll(@Query('page') page: number) {
        return this.projectPostService.findAll(page);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myProject')
    findMyProject(@Req() req) {
        return this.projectPostService.findMyProject(+req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Get('/myProjectApplicant')
    myApplicant(@Req() req) {
        return this.projectPostService.myApplicant(+req.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectPostService.findOne(+id);
    }

    @UseGuards(BearerTokenGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id') id: string,
        @Body() updateProjectPostDto: UpdateProjectPostDto,
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.projectPostService.update(+id, updateProjectPostDto, +req.userId, file);
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
    @Get(':id/projectApplicant')
    findAcceptApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.findAcceptApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete(':id/projectApplicant')
    removeProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.removeProjectApplicant(+id, +req.userId);
    }
}
