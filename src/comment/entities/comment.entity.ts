import { IsNumber } from 'class-validator';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    postId: number;

    @Column()
    userId: number;

    @Column({ nullable: true })
    parentId: number;

    @Column()
    content: string;

    @Column({ default: 0 })
    @IsNumber()
    likes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    users: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
}
