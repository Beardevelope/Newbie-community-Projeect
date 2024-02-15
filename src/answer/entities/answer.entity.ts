import { IsNotEmpty, IsString } from 'class-validator';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'answer' })
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty({ message: '필수 항목을 작성해주세요' })
    @IsString()
    answer: string;

    // ENUM or STRING
    @Column()
    @IsNotEmpty({ message: '지원 희망 기술을 작성해주세요' })
    @IsString()
    stack: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    questionId: number;

    @OneToOne((type) => Question, (question) => question.answer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column()
    userId: number;

    @ManyToOne((type) => User, (user) => user.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
