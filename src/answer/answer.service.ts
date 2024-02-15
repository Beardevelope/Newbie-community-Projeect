import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
        @InjectRepository(NeedInfo) private readonly needInfoRepository: Repository<NeedInfo>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    // 답변 생성
    async create(
        projectPostId: number,
        questionId: number,
        userId: number,
        createAnswerDto: CreateAnswerDto,
    ) {
        const { answer, stack } = createAnswerDto;

        await this.findStack(projectPostId, stack);

        const result = await this.answerRepository.save({
            questionId,
            answer,
            stack,
            userId,
        });

        return result;
    }

    // 답변 전체 목록 조회 (테스트하기)
    async findAll(projectPostId: number, userId: number) {
        const questions = await this.questionRepository.find({ where: { projectPostId } });

        const promises = questions.map(async (question) => {
            const answer = await this.answerRepository.findOne({
                where: { questionId: question.id, userId },
            });
            const user = await this.userRepository.findOne({ where: { id: answer.userId } });

            return {
                answer,
                user,
            };
        });

        const result = await Promise.all(promises);

        return result;
    }

    // 답변 수정
    async update(
        projectPostId: number,
        questionId: number,
        userId: number,
        updateAnswerDto: UpdateAnswerDto,
    ) {
        const { answer, stack } = updateAnswerDto;

        await this.findStack(projectPostId, stack);

        const oldAnswers = await this.answerRepository.find({ where: { userId } });

        oldAnswers.map(async (oldAnswer) => {
            if (oldAnswer.stack !== stack) {
                await this.answerRepository.update({ userId }, { stack });
            }
        });

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
