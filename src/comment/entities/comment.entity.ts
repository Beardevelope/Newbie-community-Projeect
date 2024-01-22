// import { IsNumber } from 'class-validator';
// import { Post } from 'src/post/entities/post.entity';
// import { UserModel } from 'src/user/entities/user.entity';
// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
// } from 'typeorm';

// @Entity({ name: 'comment' })
// export class Comment {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     content: string;

//     @Column()
//     @IsNumber()
//     likes: number;

//     @Column()
//     postId: number;

//     @Column()
//     userId: number;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;

//     @ManyToOne(() => UserModel, (user) => user.comments)
//     user: UserModel;

//     @ManyToOne(() => Post, (post) => post.comments)
//     post: Post;
// }
