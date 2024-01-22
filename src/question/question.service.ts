import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    ) {}

    // 질문 생성
    async create(projectPostId: number, createQuestionDto: CreateQuestionDto) {
        const { question } = createQuestionDto;

        const result = await this.questionRepository.save({
            projectPostId,
            question,
        });

        return result;
    }

    // 질문 목록 조회
    async findAll(projectPostId: number) {
        const result = await this.questionRepository.find({ where: { projectPostId } });

        return result;
    }

    // 특정 질문만 변경할 수 있게 변경 예정
    async update(projectPostId: number, id: number, updateQuestionDto: UpdateQuestionDto) {
        const { question } = updateQuestionDto;

        await this.questionRepository.update(
            { projectPostId, id },
            {
                question,
            },
        );

        const result = await this.questionRepository.findOne({
            where: { projectPostId, id },
        });

        if (_.isNil(result)) {
            throw new BadRequestException('존재하지않은 프로젝트입니다');
        }

        return result;
    }
}
