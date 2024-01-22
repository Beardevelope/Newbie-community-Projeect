import { PartialType } from '@nestjs/swagger';
import { CreateProjectPostDto } from './create-project-post.dto';

export class UpdateProjectPostDto extends PartialType(CreateProjectPostDto) {}
