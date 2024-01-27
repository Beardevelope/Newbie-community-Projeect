import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'dotenv';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const { id, name, emails } = profile;
        console.log(accessToken, '+++++++++++++++++++++++++++++++++++');
        console.log(refreshToken, '----------------------------------');

        const providerId = id;
        const email = emails[0].value;

        // nickname = Google name 치환
        const nickname = name.givenName + ' ' + name.familyName;

        const password = 'oauth-password';

        const user: User = await this.userService.createUserByGoogle(
            email,
            nickname,
            password,
            providerId,
        );

        return user;
    }
}
