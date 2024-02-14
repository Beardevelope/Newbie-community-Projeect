import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Answer } from 'src/answer/entities/answer.entity';
import { Banner } from 'src/banner/entities/banner.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommentLike } from 'src/comment-like/entitis/comment-like.entity';
import { ProjectLike } from 'src/project-like/entities/project-like.entity';
import { Post } from 'src/post/entities/post.entity';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProjectApplicant } from 'src/project-post/entities/project-applicant.entity';
import { PostLike } from 'src/post-like/entities/post-like.entity';
import { Warning } from 'src/warning/entities/warning.entity';
import { Alarm } from 'src/alarm/entities/alarm.entity';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isVerified: boolean;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Column()
    bannedDate: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Column()
    password: string;

    @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
    @IsString()
    @Column()
    nickname: string;

    @Column()
    warningCount: number;

    @Column()
    providerId: string;

    @Column()
    isAdmin: boolean;
    // 권한은 isAdmin도 괜찮지만 Role이라는 string으로 받아도 ㄱㅊ다.
    // 확장성 고려. 코드상에서 enum타입을 사용시에는 확장에 대한 어려움은 없으나.
    // DB에서의 Enum은 문제가 될 수 있다.

    @Column()
    isBan: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ nullable: true })
    profileImage?: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
    commentLikes: CommentLike[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany((type) => PostLike, (postLike) => postLike.user)
    postLikes: PostLike[];

    @OneToMany((type) => Warning, (warning) => warning.user)
    warnings: Warning[];

    @OneToMany(() => Banner, (banner) => banner.user)
    banners: Banner[];

    @OneToMany(() => Answer, (answer) => answer.user)
    answers: Answer[];

    @OneToMany(() => ProjectLike, (projectLike) => projectLike.user)
    projectLike: ProjectLike[];

    async serializeUser(): Promise<number> {
        return this.id;
    }

    @OneToMany(() => ProjectPost, (projectPost) => projectPost.user)
    projectPost: ProjectPost[];

    @OneToMany(() => ProjectApplicant, (projectApplicant) => projectApplicant.user)
    projectApplicant: ProjectApplicant[];

    @OneToMany((type) => Alarm, (alarm) => alarm.user)
    alarms: Alarm[];
}
