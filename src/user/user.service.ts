import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DUPLICATE_EMAIL, PASSWORD_NOT_MATCH } from './const/users-error-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    /**
     * 회원가입
     * @param CreateUserDto
     */

    async signup(createUserDto: CreateUserDto) {
        const findUser = await this.getUserByEmail(createUserDto.email);

        if (findUser) {
            throw new BadRequestException(DUPLICATE_EMAIL);
        }

        if (createUserDto.password !== createUserDto.passwordConfirm) {
            throw new BadRequestException(PASSWORD_NOT_MATCH);
        }

        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            +process.env.BCRYPT_SALT_ROUND,
        );

        const newUser = await this.usersRepository.save({
            email: createUserDto.email,
            password: hashedPassword,
            nickname: createUserDto.nickname,
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

    /**
     * email로 유저 조회
     * @param email
     */

    getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
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
}
