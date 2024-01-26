import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { BannerModule } from './banner/banner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env-validate.config';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmModuleOptions } from './configs/database.config';
import { ProjectPostModule } from './project-post/project-post.module';
import { QuestionModule } from './question/question.module';
import { NeedInfoModule } from './need-info/need-info.module';
import { AnswerModule } from './answer/answer.module';
import { LikeModule } from './like/like.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { UploadServiceModule } from './upload-service/upload-service.module';
import { AlarmModule } from './alarm/alarm.module';
@Module({
    imports: [
        UserModule,
        AuthModule,
        PostModule,
        CommentModule,
        BannerModule,
        ProjectPostModule,
        QuestionModule,
        NeedInfoModule,
        AnswerModule,
        LikeModule,
        CommentLikeModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: configModuleValidationSchema,
        }),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_KEY,
        }),
        AlarmModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
