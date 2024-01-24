import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectPost } from './project-post.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'project_applicant' })
export class ProjectApplicant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    projectPostId: number;

    @ManyToOne((type) => ProjectPost, (projectPost) => projectPost.projectApplicant)
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;

    @Column()
    userId: number;

    @ManyToOne((type) => User, (user) => user.projectApplicant)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
