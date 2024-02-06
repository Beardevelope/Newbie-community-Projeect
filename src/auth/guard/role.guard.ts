import { CanActivate, ExecutionContext, Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
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
