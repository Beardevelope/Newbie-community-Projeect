// import { IsNotEmpty, IsString } from 'class-validator';
// import { UserModel } from 'src/user/entities/user.entity';
// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     ManyToOne,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
// } from 'typeorm';

// @Entity({ name: 'banners' })
// export class Banner {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     @IsNotEmpty({ message: '입력란을 확인해주세요' })
//     @IsString()
//     title: string;

//     @Column()
//     @IsString()
//     url: string;

//     @Column()
//     userId: number;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;

//     // @ManyToOne((type) => UserModel, (user) => user.banners)
//     // user: UserModel;
// }
