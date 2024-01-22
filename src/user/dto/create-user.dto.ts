import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends PickType(User, ['email', 'password', 'nickname']) {
    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    nickname: string;
}
