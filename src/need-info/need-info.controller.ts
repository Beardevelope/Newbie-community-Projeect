import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NeedInfoService } from './need-info.service';
import { CreateNeedInfoDto } from './dto/create-need-info.dto';
import { UpdateNeedInfoDto } from './dto/update-need-info.dto';

@Controller('need-info')
export class NeedInfoController {
    constructor(private readonly needInfoService: NeedInfoService) {}

    @Post(':projectPostId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Body() createNeedInfoDto: CreateNeedInfoDto,
        @Req() req,
    ) {
        return this.needInfoService.create(+projectPostId, createNeedInfoDto, req.user.id);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.needInfoService.findAll(+projectPostId);
    }

    @Patch('/:projectPostId/:id')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('id') id: string,
        @Body() updateNeedInfoDto: UpdateNeedInfoDto,
        @Req() req,
    ) {
        return this.needInfoService.update(+projectPostId, +id, updateNeedInfoDto, req.user.id);
    }

    @Delete('/:projectPostId/:id')
    remove(@Param('projectPostId') projectPostId: string, @Param('id') id: string, @Req() req) {
        return this.needInfoService.remove(+projectPostId, +id, req.user.id);
    }
}
