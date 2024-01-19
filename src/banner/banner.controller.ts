import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    // 새 배너 생성
    @Post()
    async createBanner(@Body() createBannerDto: CreateBannerDto) {
        return await this.bannerService.createBanner(createBannerDto);
    }

    // 특정 배너 조회
    @Get(':id')
    async getBanner(@Param('id') id: string) {
        return await this.bannerService.getBannerById(+id);
    }

    // 배너 수정
    @Put(':id')
    async updateBanner(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
        return await this.bannerService.updateBanner(+id, updateBannerDto);
    }

    // 배너 삭제
    @Delete(':id')
    async deleteBanner(@Param('id') id: string) {
        return await this.bannerService.deleteBanner(+id);
    }

    // 배너 클릭 이벤트
    @Get(':id/click')
    async getBannerClick(@Param('id') id: string) {
        return this.bannerService.clickBanner(+id);
    }
}
