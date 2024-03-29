import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { UserService } from 'src/user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WarningService {
    constructor(
        @InjectRepository(Warning)
        private readonly warningRepository: Repository<Warning>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
    ) {}

    /**
     * 사용자가 게시글을 신고하는 api
     * @param userId
     * @param postId
     * @returns
     */
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

    /**
     * admin 신고횟수가 5회 이상인 게시글 조회 api
     * @returns
     */
    async findAllPosts() {
        return await this.postRepository.find({
            where: {
                warning: MoreThan(3),
            },
            relations: { warnings: true },
        });
    }

    /**
     * 경고 전체 조회 api
     * @returns
     */
    async findAll() {
        return await this.warningRepository.find({});
    }

    /**
     * 담당자가 게시글별로 누가 신고하였는지 얼마만큼 신고하였는지 조회하는 api
     * @param postId
     * @returns
     */

    async findAllByUser(postId: number) {
        return await this.warningRepository.find({
            where: {
                postId,
            },
        });
    }

    /**
     *   해당 유저에게 경고를 주는 API
     * @param userId
     * @returns
     */

    async warningUser(userId: number) {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new NotFoundException('해당 유저는 존재하지 않습니다.');
        }

        user.warningCount++;
        await this.userService.updateUser(userId, user);
        return user;
    }

    /**
     *  특정 유저 BAN시키기 -> 일단 admin이 직접 벤 하는 것으로 구현하긴 했지만 자동화는 별론가?
     * @param userId
     * @returns
     */

    async restrictUser(userId: number) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new NotFoundException('해당 유저는 존재하지 않습니다.');
        }

        if (user.warningCount <= 3) {
            throw new BadRequestException('해당 유저는 벤을 당할 경고 누적을 채우지 않았습니다.');
        }
        user.isBan = true;
        const banDate = new Date();
        user.bannedDate = banDate;

        await this.userService.updateUser(userId, user);
        return user;
    }

    @Cron('0 0 * * * *')
    async cancelBan() {
        // 벤당한 사람들을 찾아온다.
        // 벤 당한 날짜(banDate)를 벤 할 때 새로 넣어주는 것이 좋을듯 new Date() 이걸 사용해서 넣어주기
        const users = await this.userService.getBanededUsers();
        users.forEach(async (user) => {
            const currentDate = new Date();
            const DateDiff = currentDate.getTime() - user.bannedDate.getTime();
            const DateDiffNumber = Math.floor(Math.abs(DateDiff / (1000 * 60 * 60 * 24)));
            if (DateDiffNumber >= 3) {
                user.isBan = false;
                user.warningCount = 0;
                await this.userService.updateUser(user.id, user);
            }
        });
    }
}
