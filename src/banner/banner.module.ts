import { BadRequestException, Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadServiceModule } from 'src/upload-service/upload-service.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Banner, BannerClick]),
        AuthModule,
        UploadServiceModule,
        MulterModule.register({
            limits: {
                // 바이트단위 입력
                fileSize: 10000000,
            },
            fileFilter: (req, file, cb) => {
                /**
                 * cb(에러,)
                 *
                 * 첫번째 파라미터 에러가 있을경우 에러 정보 입력
                 * 두번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다.
                 */

                // ex) xxx.jpg에서 jpg(확장자)만 따올 수 있음.
                const ext = extname(file.originalname);

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
                    return cb(
                        new BadRequestException('jpg/jpeg/png/gif 파일만 업로드 가능'),
                        false,
                    );
                }
                return cb(null, true);
            },
        }),
    ],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
