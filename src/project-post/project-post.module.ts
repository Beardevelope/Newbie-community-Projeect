import { Module } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { ProjectPostController } from './project-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectPost])],
    controllers: [ProjectPostController],
    providers: [ProjectPostService],
})
export class ProjectPostModule {}
