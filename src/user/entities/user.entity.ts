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

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Column()
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
    isAdmin: boolean;
    // 권한은 isAdmin도 괜찮지만 Role이라는 string으로 받아도 ㄱㅊ다.
    // 확장성 고려. 코드상에서 enum타입을 사용시에는 확장에 대한 어려움은 없으나.
    // DB에서의 Enum은 문제가 될 수 있다.

    @Column()
    techType: string;

    @Column({ default: null, nullable: true })
    name: string;

    @Column({ default: null, nullable: true })
    contact: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ nullable: true })
    profileImage: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany((type) => Banner, (banner) => banner.user)
    banners: Banner[];

    @OneToMany((type) => Answer, (answer) => answer.user)
    answer: Answer[];

    @OneToMany((type) => Like, (like) => like.user)
    like: Like[];
}
