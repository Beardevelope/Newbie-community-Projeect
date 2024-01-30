import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';

@Module({
  controllers: [AlarmController],
  providers: [AlarmService],
  exports: [ AlarmService ],
  imports: [
    TypeOrmModule.forFeature([Alarm])
  ]
})
export class AlarmModule {}
