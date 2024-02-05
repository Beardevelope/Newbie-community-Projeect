import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { PostLike } from 'src/post-like/entities/post-like.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    @IsNotEmpty({ message: '입력란을 확인해주세요' })
    @IsString()
    title: string;

    @Column()
    @IsNotEmpty({ message: '입력란을 확인해주세요' })
    @IsString()
    content: string;

    @Column()
    @IsString()
    image: string;

    @Column()
    @IsNumber()
    likes: number;

    @Column({ default: 'unfinished' })
    status: string;

    @Column()
    hitCount: number;

    @Column()
    warning: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne((type) => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToMany((type) => Tag, (tag) => tag.posts, { cascade: true })
    @IsNotEmpty({ message: '입력란을 확인해주세요' })
    @JoinTable()
    tags: Tag[];

    @OneToMany((type) => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany((type) => PostLike, (postLike) => postLike.post)
    postLikes: PostLike[];
}
