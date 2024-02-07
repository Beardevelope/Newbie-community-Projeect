import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
    EMPTY_USER,
    EXPIRE_TOKEN,
    INVALID_TOKEN,
    NOT_EQUALS_PASSWORD,
} from './const/auth.excption-message';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     *  로그인
     * @param user
     * @returns login > existingUser
     */

    async loginWithEmail(user: Pick<User, 'email' | 'password'>) {
        const existingUser = await this.authenticate(user);

        return this.loginUser(existingUser);
    }

    loginUser(user: Pick<User, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    }
    /**
     * 유저 검증
     * @param user
     * @returns existingUser
     */

    async authenticate(user: Pick<User, 'email' | 'password'>) {
        console.log(user, '---------------------');
        const existingUser = await this.userService.getUserByEmail(user.email);

        if (!existingUser) {
            throw new UnauthorizedException(EMPTY_USER);
        }
        console.log(existingUser);
        const comparingPassword = await bcrypt.compare(user.password, existingUser.password);
        if (!comparingPassword) {
            throw new UnauthorizedException(NOT_EQUALS_PASSWORD);
        }
        return existingUser;
    }
    /**
     * 토큰발급
     * @param user
     * @param isRefreshToken
     * @returns
     */

    signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
                id: user.id,
                type: isRefreshToken ? 'refresh' : 'access',
            },
            { expiresIn: isRefreshToken ? '1h' : '1h' },
        );

        return token;
    }

    /**
     * Token 추출
     */

    async extractToken(header: string, isBearer: boolean) {
        const splitToken = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException(INVALID_TOKEN);
        }

        const token = splitToken[1];
        return token;
    }
    /**
     * 토큰 검증
     */

    verifyToken(rowToken: string) {
        try {
            const result = this.jwtService.verify(rowToken);
            return result;
        } catch (error) {
            throw new UnauthorizedException(EXPIRE_TOKEN);
        }
    }

    /**
     * Basic token = sldkfhjqlkwehrklh
     *
     * 1) sldkfhjqlkwehrklh -> email:password로 변형
     * 2)  email:password  -> [email, password]로 변형
     * 3) {email: email, password : password}로 변형
     *
     * 인코딩된 header의 authorization 토큰을 decoding 하기위함
     */

    decodeBasicToken(base64String: string) {
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decoded.split(':');
        if (split.length !== 2) {
            throw new UnauthorizedException('잘못된 유형 토큰');
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        };
    }

    /**
     * 토큰 재발급
     * @param rowToken
     * @param isRefresh
     */

    rotateToken(rowToken: string, isRefresh: boolean) {
        const result = this.jwtService.verify(rowToken);

        return this.signToken(
            {
                ...result,
            },
            isRefresh,
        );
    }

    googleLogin(req) {
        if (!req.user) {
            return ' No user from google';
        }

        return {
            message: ' User information from google',
            user: req.user,
        };
    }

    async verificationUser(userId: number) {
        const user = await this.userService.getUserById(userId);

        if (user) {
            user.isVerified = true;
            await this.userService.updateUser(userId, { isVerified: true });
        }
    }
}
