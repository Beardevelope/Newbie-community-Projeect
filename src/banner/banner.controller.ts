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
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicTokenGuard } from 'src/auth/guard/basic.guard';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    // 새 배너 생성
    @UseGuards(BasicTokenGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createBanner(
        @Request() req,
        @UploadedFile() file,
        @Body() createBannerDto: CreateBannerDto,
    ) {
        const userId = req.user.id;
        return await this.bannerService.createBanner(userId, createBannerDto);
    }

    // multer로 파일 업로드
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        console.log('========================================================');
        console.log({ file });
        console.log('========================================================');
        if (!file) {
            throw new Error('이미지를 업로드 해주세요.');
        }
        return { message: '이미지가 저장 되었습니다.' };
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

    // 배너 수정
    @UseGuards(BasicTokenGuard)
    @Put(':id')
    async updateBanner(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBannerDto: UpdateBannerDto,
    ) {
        const userId = req.user.id;
        const updateBanner = await this.bannerService.updateBanner(userId, id, updateBannerDto);
        return {
            statusCode: HttpStatus.OK,
            updateBanner,
        };
    }

    // 배너 삭제
    @UseGuards(BasicTokenGuard)
    @Delete(':id')
    async deleteBanner(@Request() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        return await this.bannerService.deleteBanner(userId, id);
    }

    // 배너 클릭 이벤트
    @UseGuards(BasicTokenGuard)
    @Get(':id/click')
    async getBannerClick(@Request() req, @Param('id', ParseIntPipe) id: number) {
        await this.bannerService.clickBanner(id);
        return {
            statusCode: HttpStatus.OK,
            message: '댓글이 삭제되었습니다.',
        };
    }
}
