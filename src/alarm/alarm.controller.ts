import { Controller, Param, Sse } from '@nestjs/common';
import { AlarmService } from './alarm.service';

@Controller('alarm')
export class AlarmController {
    constructor(private readonly alarmService: AlarmService) {}

    @Sse(':userId')
    async alarm(@Param('userId') userId: number) {
        return await this.alarmService.sendCommentAddedEvent(+userId);
    }
}
