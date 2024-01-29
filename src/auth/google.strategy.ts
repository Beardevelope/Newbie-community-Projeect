import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'dotenv';
import { AuthService } from './auth.service';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ) {
        const { id, name, emails } = profile;
        console.log(accessToken, '+++++++++++++++++++++++++++++++++++');
        console.log(refreshToken, '----------------------------------');

        const providerId = id;
        const email = emails[0].value;

        // nickname = Google name 치환
        const nickname = name.givenName + ' ' + name.familyName;

        const password = 'oauth-password';

        let user = await this.userService.getUserByEmail(email);

        if (!user) {
            user = await this.userService.createUserByGoogle(email, nickname, password, providerId);
        }

        done(null, user);
    }
}
