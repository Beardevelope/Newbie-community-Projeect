import { PickType } from '@nestjs/mapped-types';
import { Comment } from '../entities/comment.entity';

export class CreateReplyDto extends PickType(Comment, ['content', 'parentId']) {}
