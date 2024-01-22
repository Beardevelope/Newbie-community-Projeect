import { PartialType } from '@nestjs/swagger';
import { Answer } from '../entities/answer.entity';

export class UpdateAnswerDto extends PartialType(Answer) {
    answer?: string;
    stack?: string;
}
