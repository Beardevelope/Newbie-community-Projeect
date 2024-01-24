import { IsNotEmpty, IsNumber } from 'class-validator';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { CommentLike } from '../../comment-like/entitis/comment-like.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
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

    @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
    @JoinColumn()
    commentLikes: CommentLike;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    @JoinColumn()
    post: Post;
}
