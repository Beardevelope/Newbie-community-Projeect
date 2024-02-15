import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProjectPost } from './project-post.entity';

@Entity({ name: 'project_applicant' })
export class ProjectApplicant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    accept: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    userId: number;

    @ManyToOne((type) => User, (user) => user.projectApplicant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    projectPostId: number;

    @ManyToOne((type) => ProjectPost, (projectPost) => projectPost.projectApplicant, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;
}
