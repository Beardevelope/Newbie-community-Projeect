import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DUPLICATE_EMAIL, PASSWORD_NOT_MATCH } from './const/users-error-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) {}

    /**
     * 이메일을 통해 유저정보 찾기
     * @param email
     */

    async findUserAndEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }

    /**
     * 회원가입
     * @param CreateUserDto
     */

    async signup(createUserDto: CreateUserDto) {
        const findUser = await this.findUserAndEmail(createUserDto.email);

        if (findUser) {
            throw new BadRequestException(DUPLICATE_EMAIL);
        }

        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new BadRequestException(PASSWORD_NOT_MATCH);
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, +process.env.SALT_KEY);

        const newUser = await this.usersRepository.save({
            email: createUserDto.email,
            password: hashedPassword,
            nickname: createUserDto.name,
        });

        return newUser;
    }

    /**
     * ID로 유저 상세조회
     * @param id
     */
    getUserById(id: number) {
        return this.usersRepository.findOne({
            where: {
                id,
            },
        });
    }

    /** 유저 정보수정
     * @Param updateUserDto
     */

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
            },
        });

        try {
            Object.assign(user, updateUserDto);
            await this.usersRepository.save(user);

            return { message: 'User updated seccessfully' };
        } catch (error) {
            throw new BadRequestException('Failed to update user');
        }
    }

    /** 유저 상세정보 추가
     *@param userId : number, name : string, contact : string
     */

    async updateUserDetails(userId: number, name: string, contact: string) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.name = name;
        user.contact = contact;

        await this.usersRepository.save(user);
    }

    /**
     * 유저 삭제(soft delete)
     * @param userId : number
     */

    async softDeleteUser(userId: number): Promise<void> {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.deletedAt = new Date();
        await this.usersRepository.save(user);
    }

    /**
     * 1. 이력서 파일업로드 (put method 만들 때 구현할것
     * 2. 핸드폰 번호 닉네임 추가하는 부분에서 인증기능 가능하면 알아보기.
     * 3. 이력서 다운로드 기능. 이력서 삭제기능 등록기능.
     */
}
