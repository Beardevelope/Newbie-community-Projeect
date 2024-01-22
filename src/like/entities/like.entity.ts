import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'like' })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne((type) => User, (user) => user.like)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    projectPostId: number;

    @ManyToOne((type) => ProjectPost, (projectPost) => projectPost.like)
    @JoinColumn({ name: 'project_post_id' })
    projectPost: ProjectPost;
}
