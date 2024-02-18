import { PickType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';
import { IsString } from 'class-validator';

export class UpdatePostDto extends PickType(Post, ['title', 'content']) {
    @IsString({ each: true })
    // tag: string[];
    tag: string;
}
