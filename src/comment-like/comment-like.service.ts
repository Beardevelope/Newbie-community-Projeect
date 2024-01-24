import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from './entitis/comment-like.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentLikeService {
    constructor(
        @InjectRepository(CommentLike)
        private readonly commentLikeRepository: Repository<CommentLike>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    // 댓글 좋아요
    async addCommentLike(userId: number, commentId: number) {
        // 해당 유저가 좋아요를 눌렀는지 확인
        const existingLike = await this.commentLikeRepository.findOne({
            where: { userId, commentId },
        });

        if (existingLike) {
            // 이미 좋아요 눌렀으면 취소
            await this.commentLikeRepository.delete(existingLike.id);
            await this.commentRepository.decrement({ id: commentId }, 'likes', 1);
            return -1;
        } else {
            // 좋아요 추가
            const newLike = this.commentLikeRepository.create({ userId, commentId });
            await this.commentLikeRepository.save(newLike);
            await this.commentRepository.increment({ id: commentId }, 'likes', 1);
            return 1;
        }
    }
}
