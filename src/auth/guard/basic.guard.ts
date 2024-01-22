/**
 * 구현할 기능
 *
 * 1) 요청 객체를 불러오고
 *      authorization header로부터 토큰 가져오기
 *
 * 2) auth.service.extractToken 이용하여 사용가능한 형태의 토큰 추출
 *
 * 3) auth.service.decodeBasicToken을 실행하여 email과 password 추출
 *
 * 4) email과 password 이용 사용가 자겨오기.
 *    authService.authenticate
 *
 * 5) 찾아낸 사용자를 (1)요청 객체에 붙여준다.
 *      req.user = user;
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { INVALID_TOKEN } from '../const/auth.excption-message';

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        // {authorization} : 'Basic asdlkfjqwlekrjklqwejr'}
        // 을 split하면 따로 뗄 수 있다.
        const rawToken = req.headers.authorization;

        if (!rawToken) {
            throw new UnauthorizedException(INVALID_TOKEN);
        }
        const token = await this.authService.extractToken(rawToken, false);

        const { email, password } = this.authService.decodeBasicToken(token);

        const user = await this.authService.authenticate({
            email,
            password,
        });
        req.user = user;

        return true;
    }
}
