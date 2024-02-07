import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project_like' })
export class ProjectLike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, (user) => user.projectLike, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    projectPostId: number;

    @ManyToOne(() => ProjectPost, (projectPost) => projectPost.projectLike, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;
}
