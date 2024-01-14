import { Module } from '@nestjs/common';
import { RecruitPostService } from './recruit-post.service';
import { RecruitPostController } from './recruit-post.controller';

@Module({
    controllers: [RecruitPostController],
    providers: [RecruitPostService],
})
export class RecruitPostModule {}
