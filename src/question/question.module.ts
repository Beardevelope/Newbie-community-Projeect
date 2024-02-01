import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Question, ProjectPost]), AuthModule],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
