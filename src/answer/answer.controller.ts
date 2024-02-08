import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':projectPostId/:questionId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Param('questionId') questionId: string,
        @Req() req,
        @Body() createAnswerDto: CreateAnswerDto,
    ) {
        return this.answerService.create(+projectPostId, +questionId, +req.userId, createAnswerDto);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.answerService.findAll(+projectPostId);
    }

    @UseGuards(BearerTokenGuard)
    @Patch('/:projectPostId/:questionId')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('questionId') questionId: string,
        @Req() req,
        @Body() updateAnswerDto: UpdateAnswerDto,
    ) {
        return this.answerService.update(+projectPostId, +questionId, +req.userId, updateAnswerDto);
    }
}
