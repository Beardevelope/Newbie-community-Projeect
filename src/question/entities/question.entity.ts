import { IsString } from 'class-validator';
import { Answer } from 'src/answer/entities/answer.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
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

@Entity({ name: 'question' })
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    question: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    projectPostId: number;

    @ManyToOne((type) => ProjectPost, (projectPost) => projectPost.question, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;

    @OneToOne((type) => Answer, (answer) => answer.question, { cascade: true })
    answer: Answer;
}
