import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Answer, Question, NeedInfo])],
    controllers: [AnswerController],
    providers: [AnswerService],
})
export class AnswerModule {}
