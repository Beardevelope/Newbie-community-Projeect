import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
