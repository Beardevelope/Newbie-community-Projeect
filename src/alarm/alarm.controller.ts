import { Controller, Get, Param, Sse, UseGuards } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmService: AlarmService) {}

    @UseGuards(BearerTokenGuard)
    @Get('storage/:userId')
    async findAll(@Param('userId') userId: number) {
        return await this.alarmService.findAll(+userId);
    }

    @Sse(':userId')
    async alarm(@Param('userId') userId: number) {
        return await this.alarmService.sendAlarmAddedEvent(+userId);
    }
}
