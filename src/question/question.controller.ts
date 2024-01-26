import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':projectPostId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Body() createQuestionDto: CreateQuestionDto,
        @Req() req,
    ) {
        return this.questionService.create(+projectPostId, createQuestionDto, +req.userId);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.questionService.findAll(+projectPostId);
    }

    @UseGuards(BearerTokenGuard)
    @Patch('/:projectPostId/:id')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
        @Req() req,
    ) {
        return this.questionService.update(+projectPostId, +id, updateQuestionDto, +req.userId);
    }
}
