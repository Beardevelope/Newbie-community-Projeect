import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto extends PickType(User, ['email', 'password', 'nickname']) {
    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: '비밀번호는 최소 6자리 입니다.' })
    password: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    name: string;

    @IsString()
    contact: string;
}
