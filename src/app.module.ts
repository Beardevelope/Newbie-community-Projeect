import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

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
import { ProjectLikeModule } from './project-like/project-like.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { UploadServiceModule } from './upload-service/upload-service.module';
import { AlarmModule } from './alarm/alarm.module';
import { TagModule } from './tag/tag.module';
import session from 'express-session';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatBotModule } from './openai/openai.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PostLikeModule } from './post-like/post-like.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './mailer/mailer.module';
import { WarningModule } from './warning/warning.module';
import { SearchModule } from './search/search.module';

@Module({
    imports: [
        PassportModule.register({ session: true }),
        UserModule,
        AuthModule,
        PostModule,
        CommentModule,
        BannerModule,
        ProjectPostModule,
        QuestionModule,
        NeedInfoModule,
        AnswerModule,
        ProjectLikeModule,
        CommentLikeModule,
        ChatBotModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: configModuleValidationSchema,
        }),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_KEY,
        }),
        TagModule,
        AlarmModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'assets'),

        }),
        PostLikeModule,
        EmailModule,
        MailerModule.forRoot({
            transport: {
                service: 'Gmail',
                auth: {
                    user: process.env.GOOGLE_APP_EMAIL,
                    pass: process.env.GOOGLE_APP_PASSWORD,
                },
            },
        }),
        WarningModule,
        SearchModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    secret: process.env.SESSION_SECRET || 'default-secret-key',
                    resave: false,
                    saveUninitialized: true,
                }),
            )
            .forRoutes('*');
    }
}
