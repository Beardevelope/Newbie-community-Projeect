import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Like, ProjectPost])],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
