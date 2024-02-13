import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EmailService } from './mailer.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('mail')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    /**
     * 메일 인증 엔드포인트
     * @param req
     * @param email
     * @returns
     */

    @UseGuards(AccessTokenGuard)
    @Post('send-verification-email')
    async sendVerificationEmail(
        @Req() req: Request,
        @Body('email') email: string,
    ): Promise<{ message: string }> {
        await this.emailService.sendVerificationEmail(email, req['userId']);

        return { message: '이메일을 성공적으로 전송했습니다.' };
    }
}
