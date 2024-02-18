import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotAcceptableException,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { INVALID_TOKEN } from '../const/auth.excption-message';
import { AuthService } from '../auth.service';

@Injectable()
export class VerifyGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

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

        const user = await this.userService.getUserById(req.userId);

        if (!user.isVerified) {
            throw new NotAcceptableException();
        }

        return true;
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

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

        const user = await this.userService.getUserById(req.userId);

        if (!user.isAdmin) {
            throw new NotAcceptableException();
        }

        return true;
    }
}

@Injectable()
export class BanGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}
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

        const user = await this.userService.getUserById(req.userId);

        if (user.isBan) {
            throw new NotAcceptableException();
        }

        return true;
    }
}
