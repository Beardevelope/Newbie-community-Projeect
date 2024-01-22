import { PartialType } from '@nestjs/mapped-types';
import { NeedInfo } from '../entities/need-info.entity';

export class CreateNeedInfoDto extends PartialType(NeedInfo) {
    stack: string;
    numberOfPeople: number;
}
