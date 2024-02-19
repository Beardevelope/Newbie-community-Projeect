import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AlarmController],
  providers: [AlarmService],
  exports: [ AlarmService ],
  imports: [
    TypeOrmModule.forFeature([Alarm]),
    AuthModule,
  ]
})
export class AlarmModule {}
