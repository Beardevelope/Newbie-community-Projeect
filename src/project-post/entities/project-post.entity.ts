import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Like } from 'src/like/entities/like.entity';
import { NeedInfo } from 'src/need-info/entities/need-info.entity';
import { Question } from 'src/question/entities/question.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProjectApplicant } from './project-applicant.entity';
import { User } from 'src/user/entities/user.entity';

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

    @Column({
        default:
            'https://nestjs-project-images.s3.ap-northeast-2.amazonaws.com/d8fa67cf-5b7a-4663-a50d-08ba051bc258',
    })
    image: string;

    @Column({ default: '모집중' })
    @IsString()
    status: string;

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

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => NeedInfo, (needInfo) => needInfo.projectPost, { cascade: true })
    needInfo: NeedInfo[];

    @OneToMany(() => Question, (question) => question.projectPost, { cascade: true })
    question: Question[];

    @OneToMany(() => Like, (like) => like.projectPost, { cascade: true })
    like: Like[];

    @ManyToOne(() => User, (user) => user.projectPost)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => ProjectApplicant, (projectApplicant) => projectApplicant.projectPost, {
        cascade: true,
    })
    projectApplicant: ProjectApplicant[];
}
