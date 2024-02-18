import { CanActivate, ExecutionContext, Injectable, NotAcceptableException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerifyGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const user = await this.userService.getUserById(req.userId);

        if (!user.isVerified) {
            throw new NotAcceptableException();
        }

        return true;
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const user = await this.userService.getUserById(req.userId);

        if (!user.isAdmin) {
            throw new NotAcceptableException();
        }

        return true;
    }
}

@Injectable()
export class BanGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const user = await this.userService.getUserById(req.userId);

        if (user.isBan) {
            throw new NotAcceptableException();
        }

        return true;
    }
}
