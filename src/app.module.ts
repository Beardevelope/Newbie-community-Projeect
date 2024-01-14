import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { RecruitPostModule } from './recruit-post/recruit-post.module';
import { CommentModule } from './comment/comment.module';
import { BannerModule } from './banner/banner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env-validate.config';
import { typeOrmModuleOptions } from './configs/database.config';

@Module({
    imports: [
        UserModule,
        AuthModule,
        PostModule,
        RecruitPostModule,
        CommentModule,
        BannerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: configModuleValidationSchema,
        }),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
