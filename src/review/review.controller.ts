import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { JwtAUthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UseGuards(JwtAUthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @UseGuards(JwtAUthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedDoc = await this.reviewService.delete(id);
        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(JwtAUthGuard)
    @Get('byProduct/:productId')
    async byProduct(@Param('productId', IdValidationPipe) productId: string) {
        return this.reviewService.findByProductId(productId);
    }
}
