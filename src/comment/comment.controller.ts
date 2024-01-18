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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    /**
     * 댓글 작성
     */
    // @UseGuards(AccessTokenGuard)
    @Post(':postId')
    async create(
        @Request() req,
        @Param('postId') postId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        const userId = req.userId;
        const comment = await this.commentService.createComment(+postId, userId, createCommentDto);

        return {
            statusCode: HttpStatus.CREATED,
            comment,
        };
    }

    /**
     * 해당 게시글 댓글 조회
     */
    @Get(':postId')
    async findAll(@Param('postId') postId: string) {
        return this.commentService.findAllCommentByPostId(+postId);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.commentService.findOne(+id);
    // }

    /**
     * 댓글 수정
     */
    // @UseGuards(AccessTokenGuard)
    @Put(':postId/:id')
    async update(
        @Request() req,
        @Param('id') id: string,
        @Param('postId') postId: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        const comment = await this.commentService.findCommentById(+id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentService.updateComment(+id, +postId, updateCommentDto);
        return {
            statusCode: HttpStatus.OK,
            comment,
        };
    }

    /**
     * 댓글 삭제
     */
    // @UseGuards(AccessTokenGuard)
    @Delete(':postId/:id')
    async remove(@Request() req, @Param('id') id: string, @Param('postId') postId: string) {
        const comment = await this.commentService.findCommentById(+id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentService.deleteComment(+id, +postId);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }

    /**
     * 대댓글 작성
     */
    // @UseGuards(AccessTokenGuard)
    @Post(':postId/:parentId')
    async createReply(
        @Request() req,
        @Param('postId') postId: string,
        @Param('parentId') parentId: string,
        @Body() createReplyDto: CreateReplyDto,
    ) {
        const userId = req.userId;
        const replyComment = await this.commentService.createReplyComment(
            +postId,
            +parentId,
            userId,
            createReplyDto,
        );
        return {
            statusCode: HttpStatus.OK,
            replyComment,
        };
    }

    // 대댓글 수정
    // @UseGuards(AccessTokenGuard)
    @Put(':postId/:parentId/:id')
    async updateReply(
        @Request() req,
        @Param('postId') postId: string,
        @Param('parentId') parentId: string,
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        const userId = req.userId;
        const replyComment = await this.commentService.updateReplyComment(
            +postId,
            +parentId,
            +id,
            userId,
            updateCommentDto,
        );
        return {
            statusCode: HttpStatus.OK,
            replyComment,
        };
    }

    // 대댓글 삭제
    // @UseGuards(AccessTokenGuard)
    @Delete(':postId/:parentId/:id')
    async deleteReply(
        @Request() req,
        @Param('postId') postId: string,
        @Param('parentId') parentId: string,
        @Param('id') id: string,
    ) {
        const comment = await this.commentService.findCommentById(+id);
        if (comment.userId !== req.userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        await this.commentService.deleteReplyComment(+id, +parentId, +postId);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }

    /**
     * 좋아요
     */
    // @UseGuards(AccessTokenGuard)
    @Put(':id/like')
    async like(@Param('id') id: string) {
        return this.commentService.likeComment(+id);
    }
}
