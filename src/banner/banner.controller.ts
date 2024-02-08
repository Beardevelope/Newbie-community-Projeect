import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request,
    ParseIntPipe,
    HttpStatus,
    Response,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    //랜덤 조회
    @Get('random')
    async getRandomBanner() {
        const randomBanner = await this.bannerService.getRandomBanner();
        return randomBanner;
    }

    // 배너 전체 조회
    @Get()
    async getAllBanner() {
        return await this.bannerService.getAllBanner();
    }

    // 특정 배너 조회
    @Get(':id')
    async getBanner(@Param('id', ParseIntPipe) id: number) {
        return await this.bannerService.getOneBanner(id);
    }

    // 배너 생성
    @UseGuards(BearerTokenGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createBanner(
        @Request() req,
        @UploadedFile() file,
        @Body() createBannerDto: CreateBannerDto,
    ) {
        const userId = req.userId;
        try {
            const result = await this.bannerService.createBanner(userId, file, createBannerDto);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    // 배너 수정
    @UseGuards(BearerTokenGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateBanner(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file,
        @Body() updateBannerDto: UpdateBannerDto,
    ) {
        const userId = req.userId;
        const updateBanner = await this.bannerService.updateBanner(
            userId,
            id,
            file,
            updateBannerDto,
        );

        return {
            statusCode: HttpStatus.OK,
            updateBanner,
        };
    }

    // 배너 삭제
    @UseGuards(BearerTokenGuard)
    @Delete(':id')
    async deleteBanner(@Request() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.userId;
        const deleteBanner = await this.bannerService.deleteBanner(userId, id);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    // 배너 클릭시 조회수 증가
    @Post('click/:bannerId')
    async clickBanner(@Param('bannerId', ParseIntPipe) bannerId: number) {
        const bannerClick = await this.bannerService.clickBanner(bannerId);
        const pageUrl = await this.bannerService.getBannerPageUrl(bannerId);
        
        return { clickCount: bannerClick.clickCount, pageUrl }; 
}