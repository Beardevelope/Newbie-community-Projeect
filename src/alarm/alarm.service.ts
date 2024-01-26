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

    private comments$: Subject<any> = new Subject();

    private observer = this.comments$.asObservable();

    // 댓글 추가 이벤트 발생 함수
    async emitCommentAddedEvent(userId: number, commentContent: string) {
        const reduceCommentTItle = `${commentContent.slice(0, 15)}...`;
        this.comments$.next({ userId, reduceCommentTItle });

        // 알람을 여기서 저장하는 로직 작성
        await this.alarmRepository.save({
            description: reduceCommentTItle,
            userId,
        });
    }

    // 댓글 추가 이벤트를 구독하는 클라이언트에게 SSE 전송
    sendCommentAddedEvent(userId: number): Observable<any> {
        return this.observer.pipe(
            // 특정 게시물의 댓글만 필터링
            filter((event) => event.userId === userId),
            // 데이터를 SSE 형식으로 변환
            map((event) => {
                return {
                    data: {
                        title: `새로운 댓글이 추가되었습니다.`,
                        description: `${event.reduceCommentTItle}`,
                    },
                } as MessageEvent;
            }),
        );
    }
}
