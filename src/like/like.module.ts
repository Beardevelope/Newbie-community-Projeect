import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Like, ProjectPost]), AuthModule],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
