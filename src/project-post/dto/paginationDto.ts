import { IsOptional, Min, IsNumber } from 'class-validator';

export class PaginationDto {
    page: number;

    pageSize: number;
}
