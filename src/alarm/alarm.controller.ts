import { Controller, Get, Param, Sse } from '@nestjs/common';
import { AlarmService } from './alarm.service';

@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmService: AlarmService) {}

    @Get('storage/:userId')
    async findAll(@Param('userId') userId: number) {
        return await this.alarmService.findAll(+userId);
    }

    @Sse(':userId')
    async alarm(@Param('userId') userId: number) {
        return await this.alarmService.sendAlarmAddedEvent(+userId);
    }
}
