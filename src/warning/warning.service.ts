import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class WarningService {
    constructor(
        @InjectRepository(Warning)
        private readonly warningRepository: Repository<Warning>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly dataSource: DataSource,
    ) {}

    // 사용자가 게시글을 신고하는 api
    async createWarning(userId: number, postId: number) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        const warning = await this.warningRepository.findOne({
            where: { userId, postId },
        });

        if (!warning) {
            const count = 1;

            const warningCount = await this.dataSource.transaction(async (manager) => {
                await manager.increment(Post, { id: postId }, 'warning', 1);
                await manager.save(Warning, { userId, postId, count });
            });
            return warningCount;
        }

        const currentDate = new Date();

        const DateDiff = currentDate.getTime() - warning.updatedAt.getTime();
        const DateDiffNumber = Math.floor(Math.abs(DateDiff / (1000 * 60 * 60 * 24)));

        if (DateDiffNumber < 1) {
            throw new BadRequestException('해당 게시글은 24시간 이후 신고가 가능합니다.');
        }

        const warningCount = await this.dataSource.transaction(async (manager) => {
            await manager.increment(Post, { id: postId }, 'warning', 1);
            await manager.increment(Warning, { userId, postId }, 'count', 1);
        });
        return warningCount;
    }

    // admin 신고횟수가 5회 이상인 게시글 조회 api
    async findAllPosts() {
        return await this.postRepository.find({
            where: {
                warning: MoreThan(3),
            },
            relations: { warnings: true },
        });
    }

    // 경고 전체 조회 api
    async findAll() {
        return await this.warningRepository.find({});
    }

    // 담당자가 유저별로 게시글을 신고한 것을 볼 수 있게 하는 api
    async findAllByUser(userId: number) {
        return await this.warningRepository.find({
            where: {
                userId,
            },
        });
    }

    // // 유저에게 경고를 주는 api
    // async warningUser(userId: number) {
    //     const user = await this.usersRepository.findOne({
    //         where: {
    //             id: userId,
    //         },
    //     });

    //     if (!user) {
    //         throw new NotFoundException('해당 유저는 존재하지 않습니다.');
    //     }

    //     if (user.warningCount > 3) {
    //         return await this.usersRepository.increment(Post, { id: userId }, 'warningCount', 1)
    //     }
    // }

    // 유저 엔티티에 warningCount가 있다는 가정하에 유저에게 서비스 이용 제한을 거는 api
    // 유저쪽에 컬럼을 생성 is_ban 이라는 것을 새로 만들어서 true면 게시글조회를 제외한
    // 나머지 기능을 쓰지 못하게끔 만드는게 좋다.
    // 이 서비스는 아무래도 유저서비스에서 구현을 하는 것이 맞을 듯?

    // async restrictUser(userId: number) {
    //     const user = await this.usersRepository.findOne({
    //         where: {
    //             id: userId,
    //         },
    //     });

    //     if (!user) {
    //         throw new NotFoundException('해당 유저는 존재하지 않습니다.');
    //     }

    //     if (user.warningCount > 3) {
    //         return await this.usersRepository.save({
    //             is_ban: true,
    //         });
    //     }
    // }
}
