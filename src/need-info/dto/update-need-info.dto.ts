import { PartialType } from '@nestjs/swagger';
import { CreateNeedInfoDto } from './create-need-info.dto';

export class UpdateNeedInfoDto extends PartialType(CreateNeedInfoDto) {}
