import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Request,
    HttpStatus,
    ForbiddenException,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // 새 댓글 작성
    @UseGuards(BearerTokenGuard)
    @Post(':postId')
    async create(
        @Request() req,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        const userId = req.userId;
        const comment = await this.commentService.createComment(postId, userId, createCommentDto);

        return {
            statusCode: HttpStatus.CREATED,
            comment,
        };
    }

    // 해당 게시글 댓글 조회
    @Get(':postId')
    async findAll(@Param('postId', ParseIntPipe) postId: number) {
        return this.commentService.findAllCommentByPostId(postId);
    }

    // 댓글 수정
    @UseGuards(BearerTokenGuard)
    @Put(':postId/:id')
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        const comment = await this.commentService.findCommentById(id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        const updateComment = await this.commentService.updateComment(id, postId, updateCommentDto);
        return {
            statusCode: HttpStatus.OK,
            updateComment,
        };
    }

    // 댓글 삭제
    @UseGuards(BearerTokenGuard)
    @Delete(':postId/:id')
    async remove(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('postId', ParseIntPipe) postId: number,
    ) {
        const comment = await this.commentService.findCommentById(id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentService.deleteComment(id, postId);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }

    // 대댓글 작성
    @UseGuards(BearerTokenGuard)
    @Post(':postId/:parentId')
    async createReply(
        @Request() req,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('parentId', ParseIntPipe) parentId: number,
        @Body() createReplyDto: CreateReplyDto,
    ) {
        const userId = req.userId;
        const replyComment = await this.commentService.createReplyComment(
            postId,
            parentId,
            userId,
            createReplyDto,
        );
        return {
            statusCode: HttpStatus.OK,
            replyComment,
        };
    }

    // 대댓글 수정
    @UseGuards(BearerTokenGuard)
    @Put(':postId/:parentId/:id')
    async updateReply(
        @Request() req,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('parentId', ParseIntPipe) parentId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        const userId = req.userId;
        const replyComment = await this.commentService.updateReplyComment(
            postId,
            parentId,
            id,
            updateCommentDto,
        );

        const comment = await this.commentService.findCommentById(id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        return {
            statusCode: HttpStatus.OK,
            replyComment,
        };
    }

    // 대댓글 삭제
    @UseGuards(BearerTokenGuard)
    @Delete(':postId/:parentId/:id')
    async deleteReply(
        @Request() req,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('parentId', ParseIntPipe) parentId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const comment = await this.commentService.findCommentById(id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentService.deleteReplyComment(id, parentId, postId);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }
}
