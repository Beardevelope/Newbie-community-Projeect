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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard, BearerTokenGuard } from '../auth/guard/bearer.guard';
import { NOT_AUTHORIZED_USER } from './const/users-error-message';
import { Request } from 'express';

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
    @UseGuards(BearerTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    async addProfile(
        @Param('userId', ParseIntPipe) userId: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request,
    ) {
        const authenticatedUser = request['userId'];

        if (authenticatedUser !== userId) {
            throw new UnauthorizedException(NOT_AUTHORIZED_USER);
        }
        const result = await this.userService.addProfileImage(userId, file.filename);

        return result;
    }
}
