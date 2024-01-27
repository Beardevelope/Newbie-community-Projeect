import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { INVALID_TOKEN, NOT_MATCH_TOKEN_TYPE } from '../const/auth.excption-message';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rawToken = req.headers.authorization;

        if (!rawToken) {
            throw new UnauthorizedException(INVALID_TOKEN);
        }

        console.log(this.authService);
        const token = await this.authService.extractToken(rawToken, true);
        if (!token) {
            throw new UnauthorizedException(INVALID_TOKEN);
        }

        const result = await this.authService.verifyToken(token);

        req.token = token;
        req.tokenType = result.type;
        req.userId = result.id;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== 'access') {
            throw new UnauthorizedException(NOT_MATCH_TOKEN_TYPE);
        }

        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== 'refesh') {
            throw new UnauthorizedException(NOT_MATCH_TOKEN_TYPE);
        }

        return true;
    }
}
