import { PartialType } from '@nestjs/mapped-types';
import { ProjectPost } from '../entities/project-post.entity';
import { IsDateString } from 'class-validator';

export class CreateProjectPostDto extends PartialType(ProjectPost) {
    title: string;
    content: string;
    image?: string;
    status?: string;
    @IsDateString()
    applicationDeadLine: Date;
    @IsDateString()
    startDate: Date;
    @IsDateString()
    dueDate: Date;
}
