import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';
import { UploadServiceService } from 'src/upload-service/upload-service.service';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
        @InjectRepository(BannerClick)
        private readonly bannerClickRepository: Repository<BannerClick>,
        private readonly uploadService: UploadServiceService,
    ) {}

    // 배너 작성자 검증
    private async verifyUserId(userId: number) {
        const bannerUser = await this.bannerRepository.findOne({ where: { userId } });
        if (!bannerUser) {
            throw new ForbiddenException('권한이 없습니다.');
        }
    }

    // 배너 전체 조회
    async getAllBanner() {
        const banner = await this.bannerRepository.find();

        return banner;
    }

    // 특정 배너 조회
    async getOneBanner(id: number) {
        const banner = await this.bannerRepository.findOne({ where: { id } });
        if (!banner) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }
        return banner;
    }

    // 배너 랜덤 조회
    async getRandomBanner() {
        const banners = await this.getAllBanner();

        const randomIndex = Math.floor(Math.random() * banners.length);
        const randomBanner = banners[randomIndex];

        return randomBanner;
    }

    // 배너 페이지 URL 조회
    async getBannerPageUrl(bannerId: number) {
        const banner = await this.getOneBanner(bannerId);
        console.log({ banner });
        return banner.pageUrl;
    }

    // 새 배너 생성
    async createBanner(userId: number, file: any, createBannerDto: CreateBannerDto) {
        const url = await this.uploadService.uploadFile(file);

        const banner = this.bannerRepository.create({ userId, file: url, ...createBannerDto });
        const newBanner = this.bannerRepository.save(banner);
        return newBanner;
    }

    // 배너 수정
    async updateBanner(userId: number, id: number, file: any, updateBannerDto: UpdateBannerDto) {
        await this.verifyUserId(userId);
        const banner = await this.getOneBanner(id);

        let url;
        if (file) {
            url = await this.uploadService.uploadFile(file);
        } else {
            url = banner.file;
        }
        const updatedTitle = updateBannerDto.title ? updateBannerDto.title : banner.title;
        const updatedPageUrl = updateBannerDto.pageUrl ? updateBannerDto.pageUrl : banner.pageUrl;

        const updatedData = {
            title: updatedTitle,
            pageUrl: updatedPageUrl,
            file: url,
        };
        await this.bannerRepository.update(id, updatedData);
        const updatedBanner = await this.getOneBanner(id);

        return updatedBanner;
    }

    // 배너 삭제
    async deleteBanner(userId: number, id: number) {
        await this.verifyUserId(userId);

        const banner = await this.getOneBanner(id);
        await this.bannerRepository.remove(banner);
    }

    // 배너 조회수
    async clickBanner(bannerId: number) {
        let bannerClick = await this.bannerClickRepository.findOne({ where: { bannerId } });

        if (!bannerClick) {
            bannerClick = new BannerClick();
            bannerClick.bannerId = bannerId;
            bannerClick.clickCount = 1; // 첫 번째 클릭이므로 1
        } else {
            bannerClick.clickCount += 1; // 처음이 아니면 조회수 증가
        }
        await this.bannerClickRepository.save(bannerClick);

        return bannerClick;
    }
}
