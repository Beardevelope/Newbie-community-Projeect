import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Answer } from 'src/answer/entities/answer.entity';
import { Banner } from 'src/banner/entities/banner.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
    @Column({ unique: true })
    email: string;

    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @IsString()
    @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
    @Column({ select: false })
    password: string;

    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    @IsString()
    @Column()
    nickname: string;

    @Column({ nullable: true })
    role: string;

    @Column()
    @IsNumber()
    points: number;

    @Column()
    techType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany((type) => Post, (post) => post.user)
    posts: Post[];

    @OneToMany((type) => Banner, (banner) => banner.user)
    banners: Banner[];

    @OneToMany((type) => Answer, (answer) => answer.user)
    answer: Answer[];

    @OneToMany((type) => Like, (like) => like.user)
    like: Like[];
}
