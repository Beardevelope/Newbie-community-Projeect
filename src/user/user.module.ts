import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { PROFILE_FOLDER_NAME, PROFILE_IMAGE_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User]),
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

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(new BadRequestException('jpg/jpeg/png 파일만 업로드 가능'), false);
                }
                return cb(null, true);
            },
            storage: multer.diskStorage({
                destination: function (req, res, cb) {
                    cb(null, PROFILE_IMAGE_PATH);
                },
                filename: function (req, file, cb) {
                    cb(null, `${uuid()}${extname(file.originalname)}`);
                },
            }),
        }),
    ],
})
export class UserModule {}
