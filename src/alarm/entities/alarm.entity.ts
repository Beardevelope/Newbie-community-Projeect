import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Alarm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '메시지가 도착하였습니다.'})
    title: string;

    @Column()
    description: string;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @ManyToOne((type) => User, (user) => user.alarms)
    // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    // user: User;
}