import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserModel } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Comment } from 'src/comment/entities/comment.entity';

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

    @Column({ default: null })
    status: string;

    @Column()
    hitCount: number;

    @Column()
    warning: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @ManyToMany((type) => Tag, (tag) => tag.posts, { cascade: true })
    @JoinTable()
    tags: Tag[];
    
    @OneToMany((type) => Comment, (comment) => comment.post)
    comments: Comment[];
}
