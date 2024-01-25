import { PickType } from '@nestjs/mapped-types';
import { Banner } from 'src/banner/entities/banner.entity';

export class CreateBannerDto extends PickType(Banner, ['title']) {}
