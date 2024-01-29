import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    UseGuards,
    Req,
    Request,
    Response,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic.guard';
import { RefreshTokenGuard } from './guard/bearer.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guard/auth.guard';

interface IOAuthUser {
    user: {
        name: string;
        email: string;
        password: string;
    };
}
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

    @Get('to-google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Response() res) {
        const { user } = req;
        res.redirect('http://localhost:3000/auth/test-guard2');
        return res.send(user);
    }
}
