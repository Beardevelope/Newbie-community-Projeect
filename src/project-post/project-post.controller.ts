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
import { BanGuard, VerifyGuard } from 'src/auth/guard/role.guard';

@Controller('project-post')
export class ProjectPostController {
    constructor(private readonly projectPostService: ProjectPostService) {}

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
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
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Get('/myProject')
    findMyProject(@Req() req) {
        return this.projectPostService.findMyProject(+req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Get('/myProjectApplicant')
    myApplicant(@Req() req) {
        return this.projectPostService.myApplicant(+req.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectPostService.findOne(+id);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
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
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.projectPostService.remove(+id, +req.userId);
    }

    @Patch(':id/increaseHitCount')
    increaseHitCount(@Param('id') id: string) {
        return this.projectPostService.increaseHitCount(+id);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Post(':id/projectApplicant')
    createProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.createProjectApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Get(':id/projectApplicant')
    findProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.findProjectApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @Get(':id/acceptApplicant')
    findAcceptApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.findAcceptApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Patch(':id/projectApplicant')
    acceptProjectApplicant(
        @Param('id') projectPostId: string,
        @Req() req,
        @Body('userId') pickeduserId: number,
    ) {
        return this.projectPostService.acceptProjectApplicant(
            +projectPostId,
            +req.userId,
            pickeduserId,
        );
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Delete(':id/projectApplicant')
    removeProjectApplicant(@Param('id') id: string, @Req() req) {
        return this.projectPostService.removeProjectApplicant(+id, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @UseGuards(BanGuard)
    @UseGuards(VerifyGuard)
    @Delete(':id/projectMember')
    removeProjectMember(@Param('id') id: string, @Req() req, @Body('userId') removeUserId: number) {
        return this.projectPostService.removeProjectMember(+id, +req.userId, removeUserId);
    }
}
