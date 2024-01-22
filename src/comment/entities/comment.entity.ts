import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNumber()
    userId: number;

    @Column()
    @IsNumber()
    postId: number;

    @Column({ nullable: true })
    parentId: number;

    @Column()
    @IsNotEmpty({ message: '댓글을 입력해주세요.' })
    content: string;

    @Column({ default: 0 })
    @IsNumber()
    likes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;
}
