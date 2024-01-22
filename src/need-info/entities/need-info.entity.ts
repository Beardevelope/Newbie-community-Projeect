import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'need_info' })
export class NeedInfo {
    @PrimaryGeneratedColumn()
    id: number;

    // ENUM or STRING
    @Column()
    @IsNotEmpty({ message: '필요 기술을 작성해주세요' })
    @IsString()
    stack: string;

    @Column()
    @IsNotEmpty({ message: '필요 인원을 작성해주세요' })
    @IsNumber()
    numberOfPeople: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    projectPostId: number;

    @ManyToOne((type) => ProjectPost, (projectPost) => projectPost.needInfo)
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;
}
