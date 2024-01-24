import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
        @InjectRepository(BannerClick)
        private readonly bannerClickRepository: Repository<BannerClick>,
    ) {}

    // 배너 전체 조회
    async getAllBanner() {
        const banner = await this.bannerRepository.find();

        return banner;
    }

    // 특정 배너 1개 조회
    async getOneBanner(id: number) {
        const banner = await this.bannerRepository.findOne({ where: { id } });
        if (!banner) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }
        return banner;
    }

    // 배너 작성자 검증
    private async verifyUserId(userId: number) {
        const bannerUser = await this.bannerRepository.findOne({ where: { userId } });
        if (!bannerUser) {
            throw new ForbiddenException('권한이 없습니다.');
        }
    }

    // 새 배너 생성
    async createBanner(userId: number, createBannerDto: CreateBannerDto) {
        const banner = this.bannerRepository.create({ userId, ...createBannerDto });
        return this.bannerRepository.save(banner);
    }

    // 배너 수정
    async updateBanner(userId: number, id: number, updateBannerDto: UpdateBannerDto) {
        await this.verifyUserId(userId);

        const banner = await this.getOneBanner(id);
        Object.assign(banner, updateBannerDto);
        return this.bannerRepository.save(banner);
    }

    // 배너 삭제
    async deleteBanner(userId: number, id: number) {
        await this.verifyUserId(userId);

        const banner = await this.getOneBanner(id);
        await this.bannerRepository.remove(banner);
    }

    // 배너 조회수
    async clickBanner(bannerId: number) {
        const bannerClick = await this.bannerClickRepository.findOne({ where: { bannerId } });
        if (!bannerClick) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }
        return bannerClick;
    }
}
