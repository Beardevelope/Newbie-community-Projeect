import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 인증메일 발송( +토큰 생성, 만료시간 생성)
     * @param email
     * @param userId
     */

    async sendVerificationEmail(email: string, userId: number): Promise<void> {
        const token = this.jwtService.sign(
            {
                email,
                id: userId,
            },

            // 만료시간을 줄여줄 필요가 있음.
            { expiresIn: '1h' },
        );
        // 리다이렉션 url에 email과 userId만 받는 token을 생성하여 인증처리
        const url = `https://newveloper.com/auth/verify/${token}`;

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
