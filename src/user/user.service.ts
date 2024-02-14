import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DUPLICATE_EMAIL, PASSWORD_NOT_MATCH } from './const/users-error-message';
import * as bcrypt from 'bcrypt';
import { UploadServiceService } from 'src/upload-service/upload-service.service';
import { TrustedAdvisor } from 'aws-sdk';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly uploadService: UploadServiceService,
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
     * 전체 유저 목록 조회
     */
    getUserList() {
        return this.usersRepository.find();
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

    /**
     * nickname으로 유저 조회
     * @param nickname
     */

    getUserByNickName(nickname: string) {
        return this.usersRepository.findOne({
            where: {
                nickname,
            },
        });
    }

    /**
     *  구글 아이디 생성 및 검증을 위한 코드 생성
     * @param email
     * @param nickname
     * @param password
     * @param providerId
     * @returns
     */

    async createUserByGoogle(
        email: string,
        nickname: string,
        password: string,
        providerId: string,
    ) {
        const user = await this.usersRepository.findOne({
            where: {
                email,
            },
        });
        if (user) {
            throw new BadRequestException('이미 가입되어있는 유저.');
        }
        const newUser = new User();
        newUser.email = email;
        newUser.nickname = nickname;
        newUser.password = password;
        newUser.providerId = providerId;

        this.usersRepository.save(newUser);

        return newUser;
    }

    /** 유저 정보수정
     * @Param updateUserDto
     */

    async updateUser(userId: number, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
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
     * 이미지 추가 로직
     */

    async addProfileImage(userId: number, profileImage: Express.Multer.File) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!profileImage) {
            throw new BadRequestException();
        }

        const url = await this.uploadService.uploadFile(profileImage);

        if (!url) {
            throw new BadRequestException();
        }

        user.profileImage = url;

        await this.usersRepository.save(user);

        return user;
    }

    async getBanededUsers() {
        return await this.usersRepository.find({
            where: {
                isBan: true,
            },
        });
    }
    
    getUserInfoAndPostsById(userId: number) {
        return this.usersRepository.findOne({
            where: {
                id: userId,
            },
            relations: {
                posts: true,
                projectPost: true,
            }
        });
    }

    async banUser(userId: number) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        try {
            Object.assign(user, { isBan: true, bannedDate: new Date()});
            await this.usersRepository.save(user);

            return { message: 'User banned successful' };
        } catch (error) {
            throw new BadRequestException('Failed to update user');
        }    }

}
