import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BannerClick } from './banner-click.entity';

@Entity({ name: 'banners' })
export class Banner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    @IsNotEmpty({ message: '제목을 입력해주세요.' })
    @IsString()
    title: string;

    @Column({ nullable: true })
    @IsNotEmpty({ message: '이미지 url을 입력해주세요.' })
    @IsString()
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.banners)
    @JoinColumn()
    user: User;

    @OneToOne(() => BannerClick, (bannerClick) => bannerClick.banner)
    bannerClick: BannerClick;
}
