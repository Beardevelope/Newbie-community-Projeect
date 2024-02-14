import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Req,
    HttpStatus,
    Put,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';
import { BasicTokenGuard } from 'src/auth/guard/basic.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    // 게시글 생성
    @UseGuards(BearerTokenGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createPostDto: CreatePostDto, @Req() req, @UploadedFile() file) {
        const userId = req.userId;

        const newPost = await this.postService.create(createPostDto, userId, file);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'ok',
            newPost,
        };
    }

    // 게시글 조회
    @Get()
    async findAll(@Query() query: string, @Req() req) {
        const { order, filter, tagName, tab, page } = req.query;
        const posts = await this.postService.findAll(order, filter, tagName, tab, +page);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            posts,
        };
    }

    // 특정 User의 게시글 조회하기
    @UseGuards(BearerTokenGuard)
    @Get('myposts')
    async getMyPosts(@Req() req) {
        const userId = req.userId;
        return await this.postService.findByUserId(userId);
    }

    // 게시글 상세 조회
    @Get(':postId')
    async findOne(@Param('postId') postId: string) {
        const post = await this.postService.findOne(+postId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 채택 - 상태 변화
    @UseGuards(BearerTokenGuard)
    @Put(':postId/status')
    async statusUpdate(@Param('postId') postId: string, @Req() req) {
        const userId = req.userId;
        const postStatus = await this.postService.statusUpdate(+postId, userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            postStatus,
        };
    }

    // 게시글 좋아요 추가
    @Put(':postId/hit')
    async addHitCount(@Param('postId') postId: string) {
        const post = await this.postService.addHitCount(+postId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 수정
    @UseGuards(BearerTokenGuard)
    @Put(':postId')
    @UseInterceptors(FileInterceptor('file'))
    async update(
        @Param('postId') postId: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req,
        @UploadedFile() file,
    ) {
        const userId = req.userId;
        const post = await this.postService.update(+postId, updatePostDto, userId, file);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 삭제
    @UseGuards(BearerTokenGuard)
    @Delete(':postId')
    async remove(@Param('postId') postId: string, @Req() req) {
        const userId = req.userId;
        const post = await this.postService.remove(+postId, +userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }
}
