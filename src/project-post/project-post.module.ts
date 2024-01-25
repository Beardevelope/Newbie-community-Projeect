import { Module } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { ProjectPostController } from './project-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { ProjectApplicant } from './entities/project-applicant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectPost, ProjectApplicant])],
    controllers: [ProjectPostController],
    providers: [ProjectPostService],
})
export class ProjectPostModule {}
