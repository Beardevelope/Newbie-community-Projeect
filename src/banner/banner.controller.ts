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
import * as AWS from 'aws-sdk';

@Controller('banner')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    // 배너 생성
    // @UseGuards(AcessTokenGuard)
    @UseGuards(BasicTokenGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createBanner(
        @Request() req,
        @UploadedFile() file,
        @Body() createBannerDto: CreateBannerDto,
    ) {
        const userId = req.user.id;
        try {
            const result = await this.bannerService.createBanner(userId, file, createBannerDto);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    // multer로 파일 업로드
    // @UseGuards(BasicTokenGuard)
    // @UseGuards(AcessTokenGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Request() req, @UploadedFile() file) {
        // const userId = req.user.id;
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
        try {
            const key = `${Date.now() + file.originalname}`;
            const upload = await new AWS.S3()
                .putObject({
                    Key: key,
                    Body: file.buffer,
                    Bucket: 'final-project-jj-bucket/banner',
                })
                .promise();
            const url = `https://final-project-jj-bucket.s3.ap-northeast-2.amazonaws.com/${key}`;

            console.log('========================================================');
            console.log({ file });
            console.log({ upload });
            console.log({ url });
            console.log('========================================================');
            return { mesage: '업로드 성공', upload, url };
        } catch (error) {
            console.log(error);
        }
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
    // @UseGuards(BearerToken)
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
    // @UseGuards(BearerToken)
    @Delete(':id')
    async deleteBanner(@Request() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user.id;
        return await this.bannerService.deleteBanner(userId, id);
    }

    // 배너 클릭 이벤트
    // @UseGuards(BasicTokenGuard)
    // @UseGuards(AccessTokenGuard)
    @Get('click/:bannerId')
    async getBannerClick(@Request() req, @Param('bannerId', ParseIntPipe) bannerId: number) {
        await this.bannerService.clickBanner(bannerId);
        return {
            statusCode: HttpStatus.OK,
        };
    }
}
