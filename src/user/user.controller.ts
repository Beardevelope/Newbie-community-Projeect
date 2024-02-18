import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
    Req,
    UnauthorizedException,
    Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard, BearerTokenGuard } from '../auth/guard/bearer.guard';
import { NOT_AUTHORIZED_USER } from './const/users-error-message';
import { Request } from 'express';
import { BasicTokenGuard } from 'src/auth/guard/basic.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        return this.userService.signup(createUserDto);
    }

    /**
     *  이미지 추가 엔드포인트
     * @param userId
     * @param file
     * @returns
     */
    @Post('profile/:userId')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    async addProfile(
        @Param('userId', ParseIntPipe) userId: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request,
    ) {
        const authenticatedUser = request['userId'];
        console.log(authenticatedUser, userId)
        if (authenticatedUser !== userId) {
            throw new UnauthorizedException(NOT_AUTHORIZED_USER);
        }
        const result = await this.userService.addProfileImage(userId, file);

        return result;
    }

    /**
     * 유저 정보 조회
     */

    @Get('list')
    async getUserInfo() {
        return await this.userService.getUserList();
    }

    /**
     * 유저 정보 수정
     * @param userId
     * @param updateUserDto
     * @returns
     */

    @Put(':userId/update')
    @UseGuards(AccessTokenGuard)
    async updateUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.updateUser(userId, updateUserDto);
    }

    /**
     * 유저 정보 삭제 soft delete
     * @param id
     * @returns
     */

    @Delete(':id/soft-delite')
    @UseGuards(AccessTokenGuard)
    async sofrDeleteUser(@Param('id') id: number) {
        return this.userService.softDeleteUser(id);
    }

    /**
     * 닉네임으로 유저 찾기
     * @param nickname
     * @returns
     */

    @Get('by-nickname/:nickname')
    async getUserByNickName(@Param('nickname') nickname: string) {
        return this.userService.getUserByNickName(nickname);
    }

    @Get('userinfo')
    @UseGuards(BearerTokenGuard)
    async getUserInfoAndPostByToken(@Req() request: Request) {
        return this.userService.getUserInfoAndPostsById(request['userId']);
    }

    @Put(':userId/banned')
    @UseGuards(AccessTokenGuard)
    async banUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.userService.banUser(userId);
    }

    @Get('by-userId/:userId')
    async getUserByUserId(@Param('userId') userId: number) {
        return this.userService.getUserById(userId);
    }
}
