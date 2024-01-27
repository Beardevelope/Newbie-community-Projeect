import { User } from 'src/user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comment_like' })
export class CommentLike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    commentId: number;

    @Column({ nullable: true })
    parentCommentId: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.commentLikes)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Comment, (comment) => comment.commentLikes, { onDelete: 'CASCADE' })
    @JoinColumn()
    comment: Comment;
}
