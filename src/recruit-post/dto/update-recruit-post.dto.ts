import { PartialType } from '@nestjs/swagger';
import { CreateRecruitPostDto } from './create-recruit-post.dto';

export class UpdateRecruitPostDto extends PartialType(CreateRecruitPostDto) {}
