import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { NeedInfoService } from './need-info.service';
import { CreateNeedInfoDto } from './dto/create-need-info.dto';
import { UpdateNeedInfoDto } from './dto/update-need-info.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('need-info')
export class NeedInfoController {
    constructor(private readonly needInfoService: NeedInfoService) {}

    @UseGuards(BearerTokenGuard)
    @Post(':projectPostId')
    create(
        @Param('projectPostId') projectPostId: string,
        @Body() createNeedInfoDto: CreateNeedInfoDto,
        @Req() req,
    ) {
        return this.needInfoService.create(+projectPostId, createNeedInfoDto, +req.userId);
    }

    @Get(':projectPostId')
    findAll(@Param('projectPostId') projectPostId: string) {
        return this.needInfoService.findAll(+projectPostId);
    }

    @UseGuards(BearerTokenGuard)
    @Patch('/:projectPostId/:id')
    update(
        @Param('projectPostId') projectPostId: string,
        @Param('id') id: string,
        @Body() updateNeedInfoDto: UpdateNeedInfoDto,
        @Req() req,
    ) {
        return this.needInfoService.update(+projectPostId, +id, updateNeedInfoDto, +req.userId);
    }

    @UseGuards(BearerTokenGuard)
    @Delete('/:projectPostId/:id')
    remove(@Param('projectPostId') projectPostId: string, @Param('id') id: string, @Req() req) {
        return this.needInfoService.remove(+projectPostId, +id, +req.userId);
    }
}
