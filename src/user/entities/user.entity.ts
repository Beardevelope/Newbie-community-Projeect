import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
// import { Banner } from 'src/banner/entities/banner.entity';
// import { Comment } from 'src/comment/entities/comment.entity';
// import { Post } from 'src/post/entities/post.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserModel {
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

    // @OneToMany(() => Comment, (comment) => comment.user)
    // comments: Comment[];

    // @OneToMany(() => Post, (post) => post.user)
    // posts: Post[];

    // @OneToMany(() => Banner, (banner) => banner.user)
    // banners: Banner[];
}
