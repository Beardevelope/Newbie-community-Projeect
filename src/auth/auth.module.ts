import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard, BearerTokenGuard, RefreshTokenGuard } from './guard/bearer.guard';
import { BasicTokenGuard } from './guard/basic.guard';
import { GoogleStrategy } from './google.strategy';

@Module({
    controllers: [AuthController],
    imports: [forwardRef(() => UserModule)],
    providers: [
        AuthService,
        BearerTokenGuard,
        BasicTokenGuard,
        AccessTokenGuard,
        RefreshTokenGuard,
        GoogleStrategy,
    ],
    exports: [AuthService, BearerTokenGuard, BasicTokenGuard, AccessTokenGuard, RefreshTokenGuard],
})
export class AuthModule {}
