import { BadRequestException, Module } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { ProjectPostController } from './project-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { ProjectApplicant } from './entities/project-applicant.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UploadServiceModule } from 'src/upload-service/upload-service.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectPost, ProjectApplicant]),
        AuthModule,
        MulterModule.register({
            limits: {
                // 바이트단위 입력
                fileSize: 10000000,
            },
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(new BadRequestException('jpg/jpeg/png 파일만 업로드 가능'), false);
                }
                return cb(null, true);
            },
        }),
        UserModule,
        UploadServiceModule,
    ],
    controllers: [ProjectPostController],
    providers: [ProjectPostService],
})
export class ProjectPostModule {}
