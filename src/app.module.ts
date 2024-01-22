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

@Module({
    imports: [
        UserModule,
        AuthModule,
        PostModule,
        CommentModule,
        BannerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: configModuleValidationSchema,
        }),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_KEY,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
