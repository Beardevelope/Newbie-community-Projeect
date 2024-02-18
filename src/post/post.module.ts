import { BadRequestException, Logger, Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ChatBotModule } from 'src/openai/openai.module';
import { CommentModule } from 'src/comment/comment.module';
import { AuthModule } from 'src/auth/auth.module';
import { Tag } from 'src/tag/entities/tag.entity';
import { UploadServiceModule } from 'src/upload-service/upload-service.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Tag]),
        forwardRef(() => ChatBotModule),
        CommentModule,
        AuthModule,
        UserModule,
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
        SearchModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
