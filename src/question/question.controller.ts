import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post(':projectPostId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Body() createQuestionDto: CreateQuestionDto,
        @Req() req,
    ) {
        return this.questionService.create(+projectPostId, createQuestionDto, req.user.id);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.questionService.findAll(+projectPostId);
    }

    @Patch('/:projectPostId/:id')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
        @Req() req,
    ) {
        return this.questionService.update(+projectPostId, +id, updateQuestionDto, req.user.id);
    }
}
