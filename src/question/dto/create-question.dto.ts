import { PartialType } from '@nestjs/mapped-types';
import { Question } from '../entities/question.entity';

export class CreateQuestionDto extends PartialType(Question) {
    question?: string;
}
