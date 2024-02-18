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
        // question : gmail로 이미 가입을 했음(일반가입) 근데 password를 받기 싫고 다음에 로그인해야할 상황이 생기면 구글 로그인 버튼을 눌러서 로그인을 하고싶음 (연동을 할 수 있는 logic이 필요하다.)
    }
}
