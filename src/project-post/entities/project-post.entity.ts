import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';
import { Question } from 'src/question/entities/question.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project_post' })
export class ProjectPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: '제목을 입력해주세요' })
    @IsString()
    title: string;

    @Column()
    @IsNotEmpty({ message: '내용을 입력해주세요' })
    @IsString()
    content: string;

    @Column()
    @IsString()
    image: string;

    @Column()
    @IsNotEmpty({ message: '마감 일자를 입력해주세요' })
    @IsDate()
    applicationDeadLine: Date;

    @Column()
    @IsNotEmpty({ message: '프로젝트 시작일을 입력해주세요' })
    @IsDate()
    startDate: Date;

    @Column()
    @IsNotEmpty({ message: '프로젝트 종료일을 입력해주세요' })
    @IsDate()
    dueDate: Date;

    @Column({ default: 0 })
    @IsNumber()
    hitCount: number;

    @Column({ default: 0 })
    @IsNumber()
    like: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany((type) => NeedInfo, (needInfo) => needInfo.projectPost)
    needInfo: NeedInfo[];

    @OneToMany((type) => Question, (question) => question.projectPost)
    question: Question[];
}
