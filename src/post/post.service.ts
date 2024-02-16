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
import { DataSource, Equal, IsNull, LessThan, Not, Raw, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { AutoReply } from 'src/openai/openai.provider';
import { CommentService } from 'src/comment/comment.service';
import { Tag } from 'src/tag/entities/tag.entity';
import { UploadServiceService } from 'src/upload-service/upload-service.service';
import { SearchService } from 'src/search/search.service';

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
        private readonly searchService: SearchService,
    ) {}

    // 게시글 생성
    async create(createPostDto: CreatePostDto, userId: number, file: any) {
        const { title, content, tag } = createPostDto;
        if (!tag) {
            throw new BadRequestException('태그를 입력해주세요')
        }
        const url = file ? await this.uploadService.uploadFile(file) : null;
        const tagArray = tag.split(',');

        const tags = [];
        for (let i = 0; i < tagArray.length; i++) {
            let existedTag = await this.tagRepository.findOne({
                where: { name: tagArray[i] },
            });

            if (!existedTag) {
                tags.push({ name: tagArray[i] });
                break;
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

        const newPost = await this.findOne(post.id);

        this.searchService.indexPost('posts', newPost);

        return post;
    }

    // 게시글 조회 기능 구현 필터까지 다 구현하기 req.query를 이용하여 구현하기
    async findAll(order: string, filter: string, tagName: string, tab: string, page: number) {
        if (
            order !== 'hitCount' &&
            order !== 'likes' &&
            order !== 'createdAt' &&
            order !== undefined
        ) {
            throw new BadRequestException('알맞는 정렬값을 입력해주세요.');
        }

        const take: number = 3;
        const skip: number = (page - 1) * take;

        const [posts, total] = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.tags', 'tags')
            .leftJoinAndSelect('post.comments', 'comments')
            .where((qb) => {
                qb.where('post.deletedAt IS NULL');

                if (filter) {
                    qb.andWhere('post.status = :filter', { filter });
                }

                if (tab === 'answered') {
                    qb.andWhere('comments.id IS NOT NULL');
                }

                if (tab === 'unAnswered') {
                    qb.andWhere('comments.id IS NULL');
                }

                if (tagName) {
                    const subQuery = qb
                        .subQuery()
                        .select('postTags.id')
                        .from('tag', 'postTags')
                        .where('postTags.name = :tagName', { tagName })
                        .getQuery();

                    qb.andWhere(`tags.id IN ${subQuery}`);
                    qb.leftJoinAndSelect('post.tags', 'allTags');
                }
            })
            .orderBy(order ? { [`post.${order}`]: 'DESC' } : undefined)
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return {
            data: posts,
            meta: {
                total,
                itemsPerPage: take,
                page,
                lastPage: Math.ceil(total / take),
            },
        };
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

        const updateStatus = foundPost.status === 'unfinished' ? 'finished' : 'unfinished';

        const updatedPost = await this.postRepository.save({
            id: postId,
            status: updateStatus,
        });

        const updatePost = await this.findOne(postId);

        this.searchService.update('posts', postId, updatePost);

        if (updatedPost.status === 'unfinished') {
            return -1;
        }
        return 1;
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

        const updatedPost = await this.findOne(postId);

        this.searchService.update('posts', postId, updatedPost);
    }

    // 게시글 수정
    async update(postId: number, updatePostDto: UpdatePostDto, userId, file: any) {
        const { title, content, tag } = updatePostDto;

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

        const url = file ? await this.uploadService.uploadFile(file) : null;
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

        const updatePost = await this.postRepository.save({
            id: postId,
            title,
            content,
            image: url,
            tags,
        });

        const updatedPost = await this.findOne(postId);

        this.searchService.update('posts', postId, updatedPost);
 
        return updatePost;
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

        this.searchService.remove('posts', postId);

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

    async findByUserId(userId: number): Promise<Post[]> {
        const posts = await this.postRepository.find({
            where: {
                userId: userId,
            },
            relations: { comments: true, tags: true },
        });
        if (!posts.length) {
            throw new BadRequestException('게시글이 없습니다.');
        }

        return posts;
    }

    // async findPostsWithWarning() {
    //     return await this.postRepository
    //         .createQueryBuilder('post')
    //         .leftJoinAndSelect('post.warning', 'warning')
    //         .where('post.warningCount > :count', { count: 3 })
    //         .getMany();
    // }
}
