import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAUthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {}

    @UseGuards(JwtAUthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAUthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = await this.topPageService.get(id);
        if (!page) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
        }
        return page;
    }

    @Get('byAlias/:alias')
    async getByAlist(@Param('alias') alias: string) {
        const page = await this.topPageService.findbyAlias(alias);
        if (!page) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
        }
        return page;
    }

    @UseGuards(JwtAUthGuard)
    @Delete('id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedPage = await this.topPageService.deleteById(id);
        if (!deletedPage) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
        }
    }

    @UseGuards(JwtAUthGuard)
    @Patch('id')
    async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
        const updatedPage = await this.topPageService.updateById(id, dto);
        if (!updatedPage) {
            throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
        }
        return updatedPage;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto.firstCategory);
    }

    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }
}
