import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannerClick } from './entities/banner-click.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Banner, BannerClick]),
        AuthModule,
        MulterModule.register({ dest: 'src/banner/uploads' }),
    ],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
