import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';
import * as AWS from 'aws-sdk';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
        @InjectRepository(BannerClick)
        private readonly bannerClickRepository: Repository<BannerClick>,
    ) {}

    // S3에 파일 업로드
    private async uploadFileS3(file: any) {
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
        try {
            const key = `${Date.now() + file.originalname}`;
            const uploadFile = await new AWS.S3()
                .putObject({
                    Key: key,
                    Body: file.buffer,
                    Bucket: 'final-project-jj-bucket',
                })
                .promise();

            const url = `https://final-project-jj-bucket.s3.ap-northeast-2.amazonaws.com/${key}`;
            console.log('========================================================');
            console.log({ url });
            console.log('========================================================');
            return uploadFile;
        } catch (error) {
            console.log({ error });
            throw new Error();
        }
    }

    // 새 배너 생성
    async createBanner(userId: number, url: any, createBannerDto: CreateBannerDto) {
        const fileUrl = await this.uploadFileS3(url);
        console.log({ fileUrl });

        const banner = this.bannerRepository.create({ userId, url, ...createBannerDto });
        console.log('========================================================');
        console.log({ banner });
        console.log('========================================================');
        const newBanner = this.bannerRepository.save(banner);
        return newBanner;
    }

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
        let bannerClick = await this.bannerClickRepository.findOne({ where: { bannerId } });
        // if (!bannerClick) {
        //     throw new NotFoundException('배너를 찾을 수 없습니다.');
        // }
        // return bannerClick;
        if (!bannerClick) {
            bannerClick = new BannerClick();
            bannerClick.bannerId = bannerId;
            bannerClick.clickCount = 1; // 첫 번째 클릭이므로 1로 초기화
        } else {
            bannerClick.clickCount += 1; // 이미 클릭 기록이 있으면 조회수 증가
        }

        // 배너 클릭 정보 저장
        await this.bannerClickRepository.save(bannerClick);

        return bannerClick;
    }
}
