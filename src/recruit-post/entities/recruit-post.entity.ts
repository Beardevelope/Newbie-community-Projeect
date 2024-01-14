import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recruit-post' })
export class RecruitPost {
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
    @IsString()
    position: string;

    @Column()
    @IsString()
    needCarrer: string;

    @Column()
    @IsDate()
    deadLine: Date;

    @Column()
    @IsNumber()
    likes: number;

    @Column()
    @IsNumber()
    hitsCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user) => user.recruitPosts)
    user: User;
}
