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
} from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { UpdatePostLikeDto } from './dto/update-post-like.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('post-like')
export class PostLikeController {
    constructor(private readonly postLikeService: PostLikeService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':postId')
    async createLike(@Param('postId') postId: string, @Req() req) {
        const userId = req.userId;
        const like = await this.postLikeService.createLike(userId, +postId);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'ok',
            like,
        };
    }

    // 내가 누른 좋아요 찾기
    @UseGuards(BearerTokenGuard)
    @Get('myLike')
    async findAllByUser(@Req() req) {
        const userId = req.userId;
        const likes = await this.postLikeService.findAllByUser(userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            likes,
        };
    }
}
