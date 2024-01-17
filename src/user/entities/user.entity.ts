import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Banner } from 'src/banner/entities/banner.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Company } from 'src/company/entity/company.entity';
import { Post } from 'src/post/entities/post.entity';
import { RecruitPost } from 'src/recruit-post/entities/recruit-post.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UsersModel {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Column({ select: false })
    @Exclude({
        toPlainOnly: true,
    })
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

    @OneToOne(() => Company, (company) => company.user)
    company: Company;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => RecruitPost, (recruitPost) => recruitPost.user)
    recruitPosts: RecruitPost[];

    @OneToMany(() => Banner, (banner) => banner.user)
    banners: Banner[];
}
