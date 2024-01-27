import { Logger, Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ChatBotModule } from 'src/openai/openai.module';
import { CommentModule } from 'src/comment/comment.module';
import { AuthModule } from 'src/auth/auth.module';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Tag]),
        forwardRef(() => ChatBotModule),
        CommentModule,
        AuthModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
