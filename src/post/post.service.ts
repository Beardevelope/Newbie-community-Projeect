import {
    BadRequestException,
    Inject,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DataSource, IsNull, LessThan, Not, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { AutoReply } from 'src/openai/openai.provider';
import { CommentService } from 'src/comment/comment.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { UploadServiceService } from 'src/upload-service/upload-service.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        private readonly dataSource: DataSource,
        @Inject(forwardRef(() => AutoReply))
        private readonly autoReply: AutoReply,
        private readonly commenService: CommentService,
        private readonly uploadService: UploadServiceService,
    ) {}

    // 게시글 생성
    async create(createPostDto: CreatePostDto, userId: number, file: any) {
        const { title, content, tag } = createPostDto;
        const url = await this.uploadService.uploadFile(file);
        const tagArray = tag.split(',');

        const tags = [];
        for (let i = 0; i < tagArray.length; i++) {
            let existedTag = await this.tagRepository.findOne({
                where: { name: tagArray[i] },
            });

            if (!existedTag) {
                tags.push({ name: tagArray[i] });
            }
            tags.push(existedTag);
        }

        const post = await this.postRepository.save({
            title,
            content,
            image: url,
            tags,
            userId,
        });

        return post;
    }

    // 게시글 조회 기능 구현 필터까지 다 구현하기 req.query를 이용하여 구현하기
    async findAll(order: string, filter: string, tagName: string, tab: string) {
        if (
            order !== 'hitCount' &&
            order !== 'likes' &&
            order !== 'createdAt' &&
            order !== undefined
        ) {
            throw new BadRequestException('알맞는 정렬값을 입력해주세요.');
        }

        const posts = await this.postRepository.find({
            where: {
                deletedAt: null,
                ...(filter && { status: `${filter}` }),
                ...(tab === 'answered' && { comments: { id: Not(IsNull()) } }),
                ...(tab === 'unAnswered' && { comments: { id: IsNull() } }),
            },
            order: {
                ...(order && { [`${order}`]: 'DESC' }),
            },
            relations: {
                tags: true,
                comments: true,
            },
        });

        if (!tagName) {
            return posts;
        }

        const filteredPosts = posts.filter((post) => post.tags.some((tag) => tag.name === tagName));
        return filteredPosts;
    }

    // 게시글 상세 조회
    async findOne(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: { comments: true, tags: true },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        return foundPost;
    }

    // 게시글 status(해결, 미해결) 수정
    async statusUpdate(postId: number, userId) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
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

    // 게시글 경고 - 누적제
    async addWarning(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        let warning = foundPost.warning + 1;

        // orm이 2번 사용되었는데 하나로 합쳐보기
        // save 할 때 deletedAt: new Date() 추가해보면서..
        await this.postRepository.save({
            id: postId,
            warning,
        });

        if (foundPost.warning > 3) {
            await this.postRepository.softDelete(foundPost.id);
        }
    }

    // 게시글 좋아요 증가 api
    async addLike(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        let likes = foundPost.likes + 1;

        await this.postRepository.save({
            id: postId,
            likes,
        });
    }

    // 조회수 증가 api
    async addHitCount(postId: number) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        let hitCount = foundPost.hitCount + 1;

        await this.postRepository.save({
            id: postId,
            hitCount,
        });
    }

    // 게시글 수정
    async update(postId: number, updatePostDto: UpdatePostDto, userId) {
        const { title, content, image, tag } = updatePostDto;

        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
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

    // 게시글 삭제
    async remove(postId: number, userId) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
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

    async autoReplyComment() {
        const posts = await this.postRepository.find({
            where: {
                createdAt: LessThan(new Date()), // Replace with your desired date comparison
                comments: {
                    id: IsNull(), // This ensures that the post has comments
                },
            },
            order: { createdAt: 'ASC' },
            take: 3,
            relations: { comments: true },
        });

        posts.forEach(async (post) => {
            if (post.comments.length <= 0) {
                const aiReplied = await this.autoReply.ask(post.content);
                await this.commenService.createComment(post.id, 1, { content: aiReplied });
            }
        });
    }
}
