import { Module } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { PostLikeController } from './post-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from './entities/post-like.entity';
import { Post } from 'src/post/entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike]),
    AuthModule
  ],
  controllers: [PostLikeController],
  providers: [PostLikeService],
})
export class PostLikeModule {}
