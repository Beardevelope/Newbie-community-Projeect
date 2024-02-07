import { Module } from '@nestjs/common';
import { ProjectLikeService } from './project-like.service';
import { ProjectLikeController } from './project-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectLike } from './entities/project-like.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectLike, ProjectPost]), AuthModule],
    controllers: [ProjectLikeController],
    providers: [ProjectLikeService],
})
export class ProjectLikeModule {}
