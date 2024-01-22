import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends PickType(UserModel, ['email', 'password', 'nickname']) {
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
