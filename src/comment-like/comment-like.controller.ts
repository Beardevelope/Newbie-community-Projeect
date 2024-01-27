import { Controller, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('like')
@UseGuards(BearerTokenGuard)
export class CommentLikeController {
    constructor(private readonly commentLikeService: CommentLikeService) {}

    // 댓글 좋아요
    @Post(':postId/:commentId')
    async addCommentLike(@Request() req, @Param('commentId', ParseIntPipe) commentId: number) {
        const userId = req.userId;
        return this.commentLikeService.addCommentLike(userId, commentId);
    }

    // 대댓글 좋아요
    @Post(':postId/:parentCommentId/:commentId')
    async addReplyCommentLike(
        @Request() req,
        @Param('parentCommentId', ParseIntPipe) parentCommentId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
    ) {
        const userId = req.userId;
        return this.commentLikeService.addCommentLike(userId, commentId);
    }
}
