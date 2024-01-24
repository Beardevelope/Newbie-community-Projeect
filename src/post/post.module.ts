import { Logger, Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { ChatBotModule } from 'src/openai/openai.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Tag]), forwardRef(() => ChatBotModule), CommentModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}
