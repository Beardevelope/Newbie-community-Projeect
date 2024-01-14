import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
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

    @Column()
    @IsDate()
    deadLine?: Date;

    @Column()
    category: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.posts)
    @JoinColumn()
    user: User;

    @OneToMany((type) => Comment, (comment) => comment.post)
    comments: Comment[];
}
