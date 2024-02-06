import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpStatus,
    Put,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('warning')
export class WarningController {
    constructor(private readonly warningService: WarningService) {}

    // 일반유저 신고기능
    @UseGuards(BearerTokenGuard)
    @Post(':postId')
    async createWarning(@Param('postId') postId: string, @Req() req) {
        const userId = req.userId;
        const warning = await this.warningService.createWarning(userId, +postId);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'ok',
            warning,
        };
    }

    // admin 경고가 5회이상인 게시글 조회 api
    @UseGuards(BearerTokenGuard)
    @Get('warningPost')
    async findAllPosts() {
        const posts = await this.warningService.findAllPosts();
        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            posts,
        };
    }

    // 경고 전체 조회
    @UseGuards(BearerTokenGuard)
    @Get()
    async findAll() {
        const warnings = await this.warningService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            warnings,
        };
    }

    // admin 누가 어떤 게시글에 신고했는지 조회하는 api
    @UseGuards(BearerTokenGuard)
    @Get(':userId')
    async findAllByUser(@Param('userId') userId: string) {
        const warnings = await this.warningService.findAllByUser(+userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            warnings,
        };
    }

    // 유저쪽에서 구현해야 할듯?
    // 유저에게 경고주는 시스템
    @UseGuards(BearerTokenGuard)
    @Put('warningUser/:userId')
    async warningUser(@Param('userId') userId: string) {
        const user =  this.warningService.warningUser(+userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            user,
        };
    }


    // // 유저쪽에서 서비스를 구현해야할듯?
    // // admin이 유저한테 제한을 거는 api
    // @UseGuards(BearerTokenGuard)
    // @Put(':userId')
    // async restrictUser (@Param('userId') userId: string) {
    //     const user =  this.warningService.restrictUser(+userId);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'ok',
    //         user,
    //     };
    // }
}
