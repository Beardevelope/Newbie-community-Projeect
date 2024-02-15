import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNeedInfoDto } from './dto/create-need-info.dto';
import { UpdateNeedInfoDto } from './dto/update-need-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NeedInfo } from './entities/need-info.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { ProjectPost } from 'src/project-post/entities/project-post.entity';

@Injectable()
export class NeedInfoService {
    constructor(
        @InjectRepository(NeedInfo) private readonly needInfoRepository: Repository<NeedInfo>,
        @InjectRepository(ProjectPost)
        private readonly projectPostRepository: Repository<ProjectPost>,
    ) {}

    // 필요 기술 스택 생성
    async create(projectPostId: number, createNeedInfoDto: CreateNeedInfoDto, userId: number) {
        const { stack, numberOfPeople } = createNeedInfoDto;

        const project = await this.projectPostRepository.findOne({ where: { id: projectPostId } });

        if (userId !== project.userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        const existStack = await this.needInfoRepository.findOne({
            where: { projectPostId, stack },
        });

        if (existStack) {
            await this.needInfoRepository.update(
                { stack },
                { numberOfPeople: existStack.numberOfPeople + numberOfPeople },
            );

            const findProject = await this.needInfoRepository.find({ where: { projectPostId } });

            return findProject;
        }

        const result = await this.needInfoRepository.save({
            projectPostId,
            stack,
            numberOfPeople,
        });

        return result;
    }

    // 필요 기술 조회
    async findAll(projectPostId: number) {
        const result = await this.needInfoRepository.find({
            where: { projectPostId },
        });
        return result;
    }

    // 필요 기술 스택 인원 변경
    async update(
        projectPostId: number,
        id: number,
        updateNeedInfoDto: UpdateNeedInfoDto,
        userId: number,
    ) {
        const { numberOfPeople } = updateNeedInfoDto;

        const project = await this.projectPostRepository.findOne({ where: { id: projectPostId } });

        if (userId !== project.userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        await this.needInfoRepository.update({ projectPostId, id }, { numberOfPeople });

        const result = await this.findById(projectPostId, id);

        return result;
    }

    // 필요 기술 스택 삭제
    async remove(projectPostId: number, id: number, userId: number) {
        await this.findById(projectPostId, id);

        const project = await this.projectPostRepository.findOne({ where: { id: projectPostId } });

        if (userId !== project.userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        await this.needInfoRepository.delete({ projectPostId, id });

        return { message: '기술 삭제 완료' };
    }

    // Id로 찾는 함수
    async findById(projectPostId: number, id: number) {
        const result = await this.needInfoRepository.findOne({ where: { projectPostId, id } });

        if (_.isNil(result)) {
            throw new BadRequestException('존재하지않는 프로젝트입니다');
        }

        return result;
    }
}
