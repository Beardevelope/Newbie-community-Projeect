import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from 'src/user/user.module';

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    imports: [UserModule],
    exports: [CommentService],
})
export class CommentModule {}
