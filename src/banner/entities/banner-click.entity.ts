import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Banner } from './banner.entity';
import { IsNumber } from 'class-validator';

@Entity({ name: 'banner_cliclk' })
export class BannerClick {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bannerId: number;

    @Column({ default: 0 })
    @IsNumber()
    clickCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Banner, (banner) => banner.bannerClick)
    banner: Banner;
}
