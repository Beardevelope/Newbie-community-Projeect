import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}
    
    // 태그 전체조회
    async findTagAll(order: string) {
        return await this.tagRepository.find({
            order: {
                ...(order && { [`${order}`]: 'DESC' }),
                name: 'ASC'
            },
        });
    }
}
