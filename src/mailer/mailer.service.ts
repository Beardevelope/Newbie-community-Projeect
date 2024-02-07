import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendVerificationEmail(email: string, userId: number): Promise<void> {
        const url = `http:/localhost:3000/auth/verify/${userId}`;

        await this.mailerService.sendMail({
            to: email,
            subject: '방구석 개발자 회원 이메일 인증',
            html: `
            <p>아래 이미지를 클릭하여 이메일 인증을 완료하세요:</p>
            <form action=${url} method="POST">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; cursor: pointer;">인증</button>
            </form>
        `,
        });
    }
}
