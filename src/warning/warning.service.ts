import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarningDto } from './dto/create-warning.dto';
import { UpdateWarningDto } from './dto/update-warning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warning } from './entities/warning.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { UserService } from 'src/user/user.service';

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
     * 담당자가 유저별로 게시글을 신고한 것을 볼 수 있게 하는 api
     * @param userId
     * @returns
     */

    async findAllByUser(userId: number) {
        return await this.warningRepository.find({
            where: {
                userId,
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

        // return await this.usersRepository.increment({ id: userId }, 'warningCount', 1);

        // 해당코드 repository직접 접근으로 updateUser method 수정후 코드 fix

        user.warningCount++;
        await this.userService.updateUser(userId, user);
    }

    /**
     *  특정 유저 BAN시키기
     * @param userId
     * @returns
     */

    async restrictUser(userId: number) {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new NotFoundException('해당 유저는 존재하지 않습니다.');
        }

        if (user.warningCount > 3) {
            user.isBan = true;

            await this.userService.updateUser(userId, user);

            return { message: 'User restricted succesfully' };
        }

        return { message: 'User not restricted' };
    }
}
