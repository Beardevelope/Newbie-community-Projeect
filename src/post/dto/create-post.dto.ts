import { PickType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';
import { IsString } from 'class-validator';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'image',
]) {
  @IsString({ each: true })
  tag: string[];
}
