import { Module } from '@nestjs/common';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentLike } from './entitis/comment-like.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Comment, CommentLike]), AuthModule],
    controllers: [CommentLikeController],
    providers: [CommentLikeService],
})
export class CommentLikeModule {}
