import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectPostDto } from './dto/create-project-post.dto';
import { UpdateProjectPostDto } from './dto/update-project-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectPost } from './entities/project-post.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { ProjectApplicant } from './entities/project-applicant.entity';
import { UploadServiceService } from 'src/upload-service/upload-service.service';

@Injectable()
export class ProjectPostService {
    constructor(
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
        @InjectRepository(ProjectApplicant)
        private readonly projectApplicantRepository: Repository<ProjectApplicant>,
        private readonly uploadService: UploadServiceService,
    ) {}

    // 토이프로젝트 생성
    async create(
        createProjectPostDto: CreateProjectPostDto,
        userId: number,
        image?: Express.Multer.File,
    ) {
        const { title, content, applicationDeadLine, startDate, dueDate } = createProjectPostDto;
        let uploadImage;
        if (image) {
            uploadImage = await this.uploadService.uploadFile(image);
        }
        const result = await this.projectPostRepository.save({
            title,
            content,
            image: uploadImage,
            userId,
            applicationDeadLine: new Date(applicationDeadLine as any),
            startDate: new Date(startDate as any),
            dueDate: new Date(dueDate as any),
        });

        return result;
    }

    // 토이프로젝트 목록 조회
    async findAll(page: number) {
        const pageSize = 10;

        const skip = (page - 1) * pageSize;

        const [sortPost, total] = await this.projectPostRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: skip,
            take: pageSize,
        });
        return { sortPost, total, page, pageSize, lastPage: Math.ceil(total / pageSize) };
    }

    // 토이프로젝트 상세 조회
    async findOne(id: number) {
        const result = await this.findById(id);

        return result;
    }

    // 내가 작성한 토이프로젝트
    async findMyProject(userId: number) {
        console.log(userId, '유저아이디');

        const result = await this.projectPostRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });

        return result;
    }

    // 토이프로젝트 수정
    async update(
        id: number,
        updateProjectPostDto: UpdateProjectPostDto,
        userId: number,
        image?: Express.Multer.File,
    ) {
        const { title, content, status, applicationDeadLine, startDate, dueDate } =
            updateProjectPostDto;

        const findById = await this.findById(id);

        if (userId !== findById.userId) {
            throw new UnauthorizedException('수정할 권한이 없습니다.');
        }

        let uploadImage;
        if (image) {
            uploadImage = await this.uploadService.uploadFile(image);
        }

        await this.projectPostRepository.update(
            { id },
            {
                title,
                content,
                status,
                image: uploadImage,
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

    // 내 지원 프로젝트 조회
    async myApplicant(userId: number) {
        const myApplicants = await this.projectApplicantRepository.find({ where: { userId } });

        const promises = myApplicants.map(async (myApplicant) => {
            return await this.projectPostRepository.findOne({
                where: { id: myApplicant.projectPostId },
            });
        });

        const result = await Promise.all(promises);

        return result;
    }

    // 프로젝트 지원 생성
    async createProjectApplicant(id: number, userId: number) {
        const existApplicant = await this.projectApplicantRepository.findOne({
            where: { projectPostId: id, userId },
        });

        if (existApplicant) {
            throw new BadRequestException('이미 지원한 프로젝트입니다');
        }

        await this.projectApplicantRepository.save({ projectPostId: id, userId: userId });

        return { message: '프로젝트 지원 완료' };
    }

    // 프로젝트 지원자 확인
    async findProjectApplicant(id: number, userId: number) {
        await this.findById(id);

        const projectPostUser = await this.projectPostRepository.findOne({ where: { userId } });

        if (userId !== projectPostUser.userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        const result = await this.projectApplicantRepository.find({ where: { projectPostId: id } });

        return result;
    }

    // 프로젝트 멤버 조회
    async findAcceptApplicant(id: number, userId: number) {
        await this.findById(id);

        const projectPostUser = await this.projectPostRepository.findOne({ where: { userId } });

        if (userId !== projectPostUser.userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        const result = await this.projectApplicantRepository.find({
            where: { projectPostId: id, accept: true },
        });

        return result;
    }

    // 프로젝트 지원 수락
    async acceptProjectApplicant(projectPostId: number, userId: number, pickeduserId: number) {
        await this.findById(projectPostId);

        const projectApplicantUser = await this.projectApplicantRepository.findOne({
            where: { userId },
        });

        if (userId !== projectApplicantUser.userId) {
            throw new UnauthorizedException('권한이 없습니다');
        }

        await this.projectApplicantRepository.update(
            { projectPostId, userId: pickeduserId },
            { accept: true },
        );

        return { message: '지원자 채용 완료' };
    }

    // 프로젝트 지원 삭제
    async removeProjectApplicant(id: number, userId: number) {
        await this.findById(id);

        const projectApplicantUser = await this.projectApplicantRepository.findOne({
            where: { userId },
        });

        if (userId !== projectApplicantUser.userId) {
            throw new UnauthorizedException('권한이 없습니다');
        }

        await this.projectApplicantRepository.delete({ projectPostId: id, userId: userId });

        return { message: '프로젝트 지원 삭제 완료' };
    }

    // 프로젝트 멤버 삭제
    async removeProjectMember(id: number, userId: number, removeUserId: number) {
        const projectAdmin = await this.findById(id);

        if (userId !== projectAdmin.userId) {
            throw new UnauthorizedException('권한이 없습니다');
        }

        await this.projectApplicantRepository.delete({ projectPostId: id, userId: removeUserId });

        return { message: '프로젝트 멤버 삭제 완료' };
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
