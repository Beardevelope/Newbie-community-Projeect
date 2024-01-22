import { PartialType } from '@nestjs/mapped-types';
import { Answer } from '../entities/answer.entity';

export class CreateAnswerDto extends PartialType(Answer) {
    answer: string;
    stack: string;
}
