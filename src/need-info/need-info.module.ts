import { Module } from '@nestjs/common';
import { NeedInfoService } from './need-info.service';
import { NeedInfoController } from './need-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedInfo } from './entities/need-info.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([NeedInfo, ProjectPost]), AuthModule],
    controllers: [NeedInfoController],
    providers: [NeedInfoService],
})
export class NeedInfoModule {}
