import { Module } from '@nestjs/common';
import { NeedInfoService } from './need-info.service';
import { NeedInfoController } from './need-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedInfo } from './entities/need-info.entity';

@Module({
    imports: [TypeOrmModule.forFeature([NeedInfo])],
    controllers: [NeedInfoController],
    providers: [NeedInfoService],
})
export class NeedInfoModule {}
