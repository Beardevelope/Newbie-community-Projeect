import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [TypeOrmModule.forFeature([User]), MulterModule.register()],
})
export class UserModule {}
