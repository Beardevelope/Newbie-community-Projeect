import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        @InjectRepository(NeedInfo) private readonly needInfoRepository: Repository<NeedInfo>,
    ) {}

    // 답변 생성 (유저 추가 예정)
    async create(projectPostId: number, questionId: number, createAnswerDto: CreateAnswerDto) {
        const { answer, stack } = createAnswerDto;

        await this.findStack(projectPostId, stack);

        const result = await this.answerRepository.save({
            questionId,
            answer,
            stack,
        });

        return result;
    }

    // 답변 전체 목록 조회 (유저정보를 가져올 로직으로 유저정보도 추가할 예정)
    async findAll(projectPostId: number) {
        const questions = await this.questionRepository.find({ where: { projectPostId } });

        const answers = questions.map(async (question) => {
            return await this.answerRepository.find({ where: { questionId: question.id } });
        });

        return answers;
    }

    // 답변 수정을 어떻게 할지 ex) 유저 지원 목록에서 변경 or 변경불가
    async update(projectPostId: number, questionId: number, updateAnswerDto: UpdateAnswerDto) {
        const { answer, stack } = updateAnswerDto;

        await this.findStack(projectPostId, stack);

        /** 
         * 
        const oldAnswer = this.answerRepository.find({ where: { userId } });

        if (oldAnswer.stack !== stack) {
            await this.answerRepository.update({ userId }, { stack });
        }

        */

        const result = await this.answerRepository.update(
            { questionId },
            {
                answer,
            },
        );

        return result;
    }

    async findStack(projectPostId: number, stack: string) {
        const needStacks = await this.needInfoRepository.find({ where: { projectPostId } });

        const findStack = needStacks.some((needStack) => {
            return needStack.stack === stack;
        });

        if (!findStack) {
            throw new BadRequestException(BAD_REQUEST);
        }
    }
}
