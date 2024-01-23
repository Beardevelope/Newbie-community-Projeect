import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommentLike } from '../comment-like/entitis/comment-like.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment, User, CommentLike]), AuthModule],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService],
})
export class CommentModule {}
