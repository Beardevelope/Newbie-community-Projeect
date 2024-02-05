import { Controller, Post, UseGuards, Req, Request, Response, Get, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic.guard';
import { RefreshTokenGuard } from './guard/bearer.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guard/auth.guard';
import { UserService } from 'src/user/user.service';
import { Token } from 'aws-sdk';

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
     *
     * @param req
     */
    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Request() req: Request, @Res() res) {
        console.log(req['user']);
        // return this.authService.googleLogin(req);
        const token = this.authService.signToken(req['user'], false);
        res.redirect(`http://localhost:3000/Auth/save-token.html?accessToken=${token}`)
        return token;
    }
}
