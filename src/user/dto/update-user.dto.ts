import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserModel } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
