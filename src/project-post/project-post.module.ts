import { Module } from '@nestjs/common';
import { ProjectPostService } from './project-post.service';
import { ProjectPostController } from './project-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { ProjectApplicant } from './entities/project-applicant.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectPost, ProjectApplicant]), AuthModule, UserModule],
    controllers: [ProjectPostController],
    providers: [ProjectPostService],
})
export class ProjectPostModule {}
