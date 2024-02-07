import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectLike } from './entities/project-like.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import _ from 'lodash';

@Injectable()
export class ProjectLikeService {
    constructor(
        @InjectRepository(ProjectLike)
        private readonly projectLikeRepository: Repository<ProjectLike>,
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
    ) {}

    async create(projectPostId: number, userId: number) {
        const getLike = await this.projectLikeRepository.findOne({
            where: { userId, projectPostId },
        });

        if (getLike) {
            await this.remove(projectPostId, userId);
            return { message: '게시물 좋아요 취소' };
        }

        await this.projectLikeRepository.save({ userId, projectPostId });

        return { message: '게시물 좋아요 성공' };
    }

    async findAll(projectPostId: number) {
        const likes = await this.projectLikeRepository.find({ where: { projectPostId } });

        return likes;
    }

    // 유저가 누른 좋아요 목록 전체 조회
    async findAllUser(userId: number) {
        const likes = await this.projectLikeRepository.find({ where: { userId } });

        return likes.map(async (like) => {
            return await this.projectPostRepository.findOne({
                where: { id: like.projectPostId },
            });
        });
    }

    async findOne(id: number, userId: number) {
        const like = await this.projectLikeRepository.findOne({ where: { id, userId } });

        if (_.isNil(like)) {
            throw new NotFoundException('존재하지않은 프로젝트입니다');
        }

        const projectPost = await this.projectPostRepository.findOne({
            where: { id: like.projectPostId },
        });
        return projectPost;
    }

    async remove(projectPostId: number, userId: number) {
        const projectPost = await this.projectLikeRepository.findOne({
            where: { projectPostId, userId },
        });

        if (_.isNil(projectPost)) {
            throw new NotFoundException('존재하지않은 프로젝트입니다');
        }

        await this.projectLikeRepository.delete({ projectPostId, userId });
        return { message: '좋아요 삭제 성공' };
    }
}
