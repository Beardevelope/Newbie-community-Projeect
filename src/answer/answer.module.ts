import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Question } from 'src/question/entities/question.entity';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Answer, Question, NeedInfo, User]), AuthModule],
    controllers: [AnswerController],
    providers: [AnswerService],
})
export class AnswerModule {}
