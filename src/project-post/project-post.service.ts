import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { ProjectApplicant } from './entities/project-applicant.entity';
import { PaginationDto } from './dto/paginationDto';

@Injectable()
export class ProjectPostService {
    constructor(
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
        @InjectRepository(ProjectApplicant)
        private readonly projectApplicantRepository: Repository<ProjectApplicant>,
    ) {}

    // 토이프로젝트 생성
    async create(createProjectPostDto: CreateProjectPostDto, userId: number) {
        const { title, content, image, applicationDeadLine, startDate, dueDate } =
            createProjectPostDto;

        const result = await this.projectPostRepository.save({
            title,
            content,
            image,
            userId,
            applicationDeadLine: new Date(applicationDeadLine as any),
            startDate: new Date(startDate as any),
            dueDate: new Date(dueDate as any),
        });

        return result;
    }

    // 토이프로젝트 목록 조회(프론트랑 연결 후 다시 확인)
    async findAll(paginationDto: PaginationDto) {
        const { page, pageSize } = paginationDto;

        const onePage = (page - 1) * pageSize;

        const sortPost = await this.projectPostRepository.find({ order: { updatedAt: 'ASC' } });

        const postOnPage = sortPost.slice(onePage, onePage + pageSize);

        return postOnPage;
    }

    // 토이프로젝트 상세 조회
    async findOne(id: number) {
        const result = await this.findById(id);

        return result;
    }

    // 토이프로젝트 수정
    async update(id: number, updateProjectPostDto: UpdateProjectPostDto, userId: number) {
        const { title, content, image, applicationDeadLine, startDate, dueDate } =
            updateProjectPostDto;

        const findById = await this.findById(id);

        if (userId !== findById.userId) {
            throw new UnauthorizedException('수정할 권한이 없습니다.');
        }

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
    async remove(id: number, userId: number) {
        const findById = await this.findById(id);

        if (userId !== findById.userId) {
            throw new UnauthorizedException('삭제할 권한이 없습니다.');
        }

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
