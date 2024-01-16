import { PartialType } from '@nestjs/swagger';
import { RecruitPost } from '../entities/recruit-post.entity';

export class CreateRecruitPostDto extends PartialType(RecruitPost) {
    title: string;
    content: string;
    image?: string;
    position?: string;
    newCarrer?: string;
    deadLine?: Date;
}
