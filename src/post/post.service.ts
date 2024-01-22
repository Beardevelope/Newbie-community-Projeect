import {
    BadRequestException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DataSource, IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        private readonly dataSource: DataSource,
    ) {}

    // 게시글 생성
    async create(createPostDto: CreatePostDto, userId: number) {
        const { title, content, image, tag } = createPostDto;

        const tags = [];
        for (let i = 0; i < tag.length; i++) {
            let existedTag = await this.tagRepository.findOne({
                where: { name: tag[i] },
            });

            if (!existedTag) {
                tags.push({ name: tag[i] });
            }
            tags.push(existedTag);
        }

        return await this.postRepository.save({
            title,
            content,
            image,
            tags,
            userId,
        });
    }

    // 게시글 조회 기능 구현 필터까지 다 구현하기 req.query를 이용하여 구현하기
    async findAll(order: string, filter: string) {
        if (order !== 'hitCount' && order !== 'likes' && order !== 'createdAt') {
            throw new BadRequestException('알맞는 정렬값을 입력해주세요.');
        }

        // 댓글이 있을 경우
        // if (filter === 'answered') {
        // return await this.postRepository.find({
        //     where: {
        //         ...(filter && { status: `${filter}` }),
        //         comments: { id: Not(IsNull()) }
        //     },
        //     order: {
        //         ...(order && { [`${order}`]: 'DESC' }),
        //     },
        // })
        // }

        // 댓글이 없을 경우
        // if (filter === 'unAnswered') {
        //     return await this.postRepository.find({
        //         where: {
        //             ...(filter && { status: `${filter}` }),
        //             comments: { id: IsNull() }
        //         },
        //         order: {
        //             ...(order && { [`${order}`]: 'DESC' }),
        //         },
        //     })
        // }

        return await this.postRepository.find({
            where: {
                ...(filter && { status: `${filter}` }),
            },
            order: {
                ...(order && { [`${order}`]: 'DESC' }),
            },
        });
    }

    // 게시글 상세 조회
    async findOne(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        return foundPost;
    }

    // 게시글 경고 - 누적제
    async addWarning(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        let warning = foundPost.warning + 1;

        await this.postRepository.save({
            id: postId,
            warning,
        });
    }

    // 게시글 수정
    async update(postId: number, updatePostDto: UpdatePostDto, userId) {
        const { title, content, image, tag } = updatePostDto;

        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        if (userId !== foundPost.userId) {
            throw new NotAcceptableException('수정할 권한이 없습니다.');
        }

        const tags = [];
        for (let i = 0; i < tag.length; i++) {
            let existedTag = await this.tagRepository.findOne({
                where: { name: tag[i] },
            });

            if (!existedTag) {
                tags.push({ name: tag[i] });
            }
            tags.push(existedTag);
        }

        const updatedPost = await this.postRepository.save({
            id: postId,
            title,
            content,
            image,
            tags,
        });

        return updatedPost;
    }

    // 게시글 status(해결, 미해결) 수정
    async statusUpdate(postId: number, userId) {
        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        if (userId !== foundPost.userId) {
            throw new NotAcceptableException('수정할 권한이 없습니다.');
        }

        const updateStatus = foundPost.status === null ? 'done' : null;

        await this.postRepository.save({
            id: postId,
            status: updateStatus,
        });
    }

    // 게시글 삭제
    async remove(postId: number, userId) {
        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        if (userId !== foundPost.userId) {
            throw new NotAcceptableException('수정할 권한이 없습니다.');
        }

        await this.postRepository.delete(postId);

        return foundPost;
    }

    // 게시글 신고로 인한 삭제
    @Cron('10 * * * * *')
    async removeByAccumulatedWarning() {
        const foundPosts = await this.postRepository.find();

        for(let i =0; i<foundPosts.length; i++) {
            if (foundPosts[i].warning > 4) {
                await this.postRepository.delete(foundPosts[i].id)
            }
        }
    }
}
