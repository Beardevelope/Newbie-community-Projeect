import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { BasicTokenGuard } from 'src/auth/guard/basic.guard';

@Controller('like')
@UseGuards(BasicTokenGuard)
export class CommentLikeController {
    constructor(private readonly commentLikeService: CommentLikeService) {}

    // 댓글 좋아요
    @Post(':postId/:commentId')
    async addCommentLike(@Request() req, @Param('commentId') commentId: string) {
        const userId = req.user.id;
        return this.commentLikeService.addCommentLike(+userId, +commentId);
    }
}
