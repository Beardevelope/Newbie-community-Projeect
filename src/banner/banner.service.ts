import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getBannerById(id: number) {
        const banner = await this.bannerRepository.findOne({ where: { id } });
        if (!banner) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }
        return banner;
    }

    async createBanner(createBannerDto: CreateBannerDto) {
        const banner = this.bannerRepository.create(createBannerDto);
        return this.bannerRepository.save(banner);
    }

    async updateBanner(id: number, updateBannerDto: UpdateBannerDto) {
        const banner = await this.getBannerById(id);
        Object.assign(banner, updateBannerDto);
        return this.bannerRepository.save(banner);
    }

    async deleteBanner(id: number) {
        const banner = await this.getBannerById(id);
        await this.bannerRepository.remove(banner);
    }

    async clickBanner(bannerId: number) {
        const bannerClick = await this.bannerClickRepository.findOne({ where: { bannerId } });
        if (!bannerClick) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }
        return bannerClick;
    }
}
