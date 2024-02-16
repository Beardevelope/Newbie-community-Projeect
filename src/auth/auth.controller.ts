import { Controller, Post, UseGuards, Req, Request, Get, Res, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic.guard';
import { RefreshTokenGuard } from './guard/bearer.guard';
import { GoogleAuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * 로그인
     * @body req
     * @returns
     */

    @Post('login')
    @UseGuards(BasicTokenGuard)
    async loginEmail(@Req() req: Request) {
        return {
            accessToken: this.authService.signToken(req['user'], false),
            refreshToken: this.authService.signToken(req['user'], true),
        };
    }

    @Post('token/access')
    @UseGuards(RefreshTokenGuard)
    rotateAccessToken(@Req() req: Request) {
        return this.authService.rotateToken(req['token'], false);
    }
    /**
     * 구글 로그인 주소
     * @param req
     */
    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {}

    /**
     * 직접적인 구글 로그인을 통한 리다이렉션 url 설정 및 토큰 반환 코드
     * @param req
     * @param res
     * @returns
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Request() req: Request, @Res() res) {
        console.log(req['user']);
        // return this.authService.googleLogin(req);
        const token = this.authService.signToken(req['user'], false);
        res.redirect(`http://bumkyulee.shop:3000/Auth/save-token.html?accessToken=${token}`);
        return token;
    }

    @Post('verify/:token')
    async verifiedUserUpdate(@Param('token') token: string) {
        await this.authService.verificationUser(token);
        return '인증 완료';
    }
}
