import { Injectable, MessageEvent } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, Subject, filter, map } from 'rxjs';
import { Alarm } from './entities/alarm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmService {
    constructor(
        @InjectRepository(Alarm)
        private readonly alarmRepository: Repository<Alarm>,
    ) {}

    private alarms$: Subject<any> = new Subject();

    private observer = this.alarms$.asObservable();

    // 댓글 추가 이벤트 발생 함수
    async emitAlarmAddedEvent(userId: number, title: string, description: string) {
        this.alarms$.next({ userId, title, description });
    }

    // 댓글 추가 이벤트를 구독하는 클라이언트에게 SSE 전송
    sendAlarmAddedEvent(userId: number): Observable<any> {
        return this.observer.pipe(
            // 특정 게시물의 댓글만 필터링
            filter((event) => event.userId === userId),
            // 데이터를 SSE 형식으로 변환
            map((event) => {
                return {
                    data: {
                        title: `${event.title}`,
                        description: `${event.description}`,
                    },
                } as MessageEvent;
            }),
        );
    }

    async createAlarm(userId: number, title: string, description: string) {
        // 알람을 여기서 저장하는 로직 작성
        const alarm = await this.alarmRepository.save({
            title,
            description,
            userId,
        });
        this.emitAlarmAddedEvent(userId, alarm.title, description);
    }

    // 해당 유저의 알람 가져오기
    async findAll(userId: number) {
        return await this.alarmRepository.find({
            where: {
                userId,
            },
        });
    }
}
