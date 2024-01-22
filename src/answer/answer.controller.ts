import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('/:projectPostId/:questionId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Param('questionId') questionId: string,
        @Body() createAnswerDto: CreateAnswerDto,
    ) {
        return this.answerService.create(+projectPostId, +questionId, createAnswerDto);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.answerService.findAll(+projectPostId);
    }

    @Patch('/:projectPostId/:questionId')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('questionId') questionId: string,
        @Body() updateAnswerDto: UpdateAnswerDto,
    ) {
        return this.answerService.update(+projectPostId, +questionId, updateAnswerDto);
    }
}
