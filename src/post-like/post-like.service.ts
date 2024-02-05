import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from './entities/post-like.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class PostLikeService {
    constructor(
        @InjectRepository(PostLike)
        private readonly postLikeRepository: Repository<PostLike>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async createLike(userId: number, postId: number) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        const like = await this.postLikeRepository.findOne({
            where: { userId, postId },
        });

        if (like) {
            await this.postLikeRepository.delete(like.id);
            await this.postRepository.decrement({ id: postId }, 'likes', 1);
            return -1;
        }

        await this.postLikeRepository.save({
            userId,
            postId,
        });
        await this.postRepository.increment({ id: postId }, 'likes', 1);
        return 1;
    }

    async findAllByUser(userId) {
        return await this.postLikeRepository.find({
            where: { userId },
        });
    }
}
