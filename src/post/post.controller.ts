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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';
import { BasicTokenGuard } from 'src/auth/guard/basic.guard';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    // 게시글 생성
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(BearerTokenGuard)
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Req() req) {
        const userId = req.user.id;

        const newPost = await this.postService.create(createPostDto, userId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'ok',
            newPost,
        };
    }

    // 게시글 조회
    @Get()
    async findAll(@Query() query: string, @Req() req) {
        const { order, filter, tagName } = req.query;
        const posts = await this.postService.findAll(order, filter, tagName);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            posts,
        };
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
    @UseGuards(AuthGuard('jwt'))
    @Put(':postId/status')
    async statusUpdate(@Param('postId') postId: string, @Req() req) {
        const userId = req.user.id;
        const post = await this.postService.statusUpdate(+postId, userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 경고 - 누적제
    @UseGuards(AuthGuard('jwt'))
    @Put(':postId/warning')
    async addWarning(@Param('postId') postId: string) {
        const post = await this.postService.addWarning(+postId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 수정
    @UseGuards(AuthGuard('jwt'))
    @Put(':postId')
    async update(
        @Param('postId') postId: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req,
    ) {
        const userId = req.user.id;
        const post = await this.postService.update(+postId, updatePostDto, userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }

    // 게시글 삭제
    @UseGuards(AuthGuard('jwt'))
    @Delete(':postId')
    async remove(@Param('postId') postId: string, @Req() req) {
        const userId = req.user.id;
        const post = await this.postService.remove(+postId, +userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'ok',
            post,
        };
    }
}
