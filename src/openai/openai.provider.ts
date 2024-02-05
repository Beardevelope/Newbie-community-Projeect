import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import OpenAI from 'openai';
import { PostService } from 'src/post/post.service';

@Injectable()
export class AutoReply {
    constructor(
        private readonly configservice: ConfigService,
        @Inject(forwardRef(() => PostService))
        private readonly postService: PostService,
    ) {}
    logger = new Logger();
    async ask(question: string) {
        const openai = new OpenAI({
            apiKey: this.configservice.get<string>('OPENAI_API_KEY'),
        });

        //completion 챗 생성
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Use language based on the language that question used, 
                    and reply within 200 characters. Answer with happily, 
                    friendly, and full of respectful.`,
                },
                { role: 'user', content: question },
            ],
            //세부사항, 정밀도, 토큰 제한, 등등
            temperature: 0.8,
            max_tokens: 500,
            top_p: 1,
        });
        return completion.choices[0].message.content;
    }

    @Cron('0 * * * * *', {
        name: 'autoReply',
    })
    async autoReplyWithChatBotHandeler() {
        try {
            await this.postService.autoReplyComment();
            this.logger.warn(`댓글 자동 답장이 실행되었습니다..`);
        } catch (error) {
            console.error(error);
            this.logger.error('댓글 자동 답장 실패.');
        }
    }
}
