import { Module } from '@nestjs/common';
import { EmailController } from './mailer.controller';
import { EmailService } from './mailer.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [EmailController],
    providers: [EmailService],
})
export class EmailModule {}
