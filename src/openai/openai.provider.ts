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

        /**
         * completion 챗 생성
         * completion는 해당 대화의 답변
         * model 처리할 엔진, 모델 고르기
         * messages 대화 내역
         * role 에서 나오는 system은 프롬프트 혹은 설정입니다
         * user는 실제 유저의 요청 혹은 질문입니다. (content 내용물)
         * temperature, maxtokens, top_p등은 세부사항으로
         * 각각 랜덤성, 토큰(글자수)제한, 다양성
         * temperature는 1의 가까울수록 랜덤
         * max_tokens 최대 토큰 수 제한 많을수록 글자 최대 수 높아짐
         * top_p, 1 가까울 수록 선택지가 넓어지고 다양성이 높아짐
         */
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
