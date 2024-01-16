import { Injectable } from '@nestjs/common';
import { CreateRecruitPostDto } from './dto/create-recruit-post.dto';
import { UpdateRecruitPostDto } from './dto/update-recruit-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecruitPost } from './entities/recruit-post.entity';
@Injectable()
export class RecruitPostService {
    constructor(
        @InjectRepository(RecruitPost) private readonly recruitRepository: Repository<RecruitPost>,
    ) {}

    async create(createRecruitPostDto: CreateRecruitPostDto) {
        const { title, content, image, position, newCarrer, deadLine } = createRecruitPostDto;

        const result = await this.recruitRepository.save({
            title,
            content,
            image,
            position,
            newCarrer,
            deadLine: new Date(deadLine as any),
        });

        return result;
    }

    async findAll() {
        return await this.recruitRepository.find();
    }

    async findOne(id: number) {
        const result = await this.recruitRepository.findOne({
            where: { id },
        });
        return result;
    }

    async update(id: number, updateRecruitPostDto: UpdateRecruitPostDto) {
        const { title, content, image, position, newCarrer, deadLine } = updateRecruitPostDto;

        const result = await this.recruitRepository.update(
            { id },
            { title, content, image, position, newCarrer, deadLine: new Date(deadLine as any) },
        );
        return result;
    }

    async remove(id: number) {
        await this.recruitRepository.delete({
            where: { id },
        });
        return {
            message: '게시글 삭제 성공하셨습니다',
        };
    }
}
