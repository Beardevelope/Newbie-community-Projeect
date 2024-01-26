import { Module, forwardRef } from '@nestjs/common';
import { AutoReply } from './openai.provider';
import { PostService } from 'src/post/post.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PostModule } from 'src/post/post.module';

@Module({
    imports: [forwardRef(() => PostModule)],
    providers: [AutoReply],
    exports: [AutoReply],
})
export class ChatBotModule {}
