import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { ProjectApplicant } from './entities/projectApplicant.entity';

@Injectable()
export class ProjectPostService {
    constructor(
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
        @InjectRepository(ProjectApplicant)
        private readonly projectApplicantRepository: Repository<ProjectApplicant>,
    ) {}

    // 토이프로젝트 생성
    async create(createProjectPostDto: CreateProjectPostDto) {
        const { title, content, image, applicationDeadLine, startDate, dueDate } =
            createProjectPostDto;

        const result = await this.projectPostRepository.save({
            title,
            content,
            image,
            applicationDeadLine: new Date(applicationDeadLine as any),
            startDate: new Date(startDate as any),
            dueDate: new Date(dueDate as any),
        });

        return result;
    }

    // 토이프로젝트 목록 조회
    async findAll() {
        const result = await this.projectPostRepository.find();

        return result;
    }

    // 토이프로젝트 상세 조회
    async findOne(id: number) {
        const result = await this.findById(id);

        return result;
    }

    // 토이프로젝트 수정
    async update(id: number, updateProjectPostDto: UpdateProjectPostDto) {
        const { title, content, image, applicationDeadLine, startDate, dueDate } =
            updateProjectPostDto;

        await this.findById(id);

        await this.projectPostRepository.update(
            { id },
            {
                title,
                content,
                image,
                applicationDeadLine: new Date(applicationDeadLine as any),
                startDate: new Date(startDate as any),
                dueDate: new Date(dueDate as any),
            },
        );

        const result = await this.findById(id);

        return result;
    }

    // 토이프로젝트 삭제
    async remove(id: number) {
        await this.projectPostRepository.delete({ id });
        return { message: '프로젝트 삭제 완료' };
    }

    // 프로젝트 조회수
    async increaseHitCount(id: number) {
        const projectPost = await this.findById(id);

        projectPost.hitCount += 1;

        await this.projectPostRepository.save(projectPost);

        return projectPost.hitCount;
    }

    // 프로젝트 지원 생성
    async createProjectApplicant(id: number, userId: number) {
        await this.findById(id);

        await this.projectApplicantRepository.save({ projectPostId: id, userId: userId });

        return { message: '프로젝트 지원 완료' };
    }

    // 프로젝트 지원 삭제
    async removeProjectApplicant(id: number, userId: number) {
        await this.findById(id);

        await this.projectApplicantRepository.delete({ projectPostId: id, userId: userId });

        return { message: '프로젝트 지원 완료' };
    }

    // Id로 찾는 함수
    async findById(id: number) {
        const result = await this.projectPostRepository.findOne({ where: { id } });

        if (_.isNil(result)) {
            throw new BadRequestException('존재하지않는 프로젝트입니다');
        }

        return result;
    }
}
