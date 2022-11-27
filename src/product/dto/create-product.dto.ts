import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProductCharacteristicDto {
    @IsString()
    name: string;

    @IsString()
    value: string;
}

export class CreateProductDto {
    @ApiProperty({ example: 'image.jpg', description: 'Наименование картинки' })
    @IsString()
    image: string;

    @ApiProperty({ example: 'Заголовок', description: 'Заголовок продукта' })
    @IsString()
    title: string;

    @ApiProperty({ example: 550, description: 'Цена продукта' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 550, description: 'Старая цена' })
    @IsOptional()
    @IsNumber()
    oldPrive?: number;

    @ApiProperty({ example: 20, description: 'Кредит' })
    @IsNumber()
    credit: number;

    @ApiProperty({ example: 'Описание продукта', description: 'Описание продукта' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'Преимущества', description: 'Преимущества продукта' })
    @IsString()
    advantages: string;

    @ApiProperty({ example: 'Недостатки', description: 'Недостатки продукта' })
    @IsString()
    disadvantages: string;

    @ApiProperty({ example: ['Первая категория', 'Вторая категория'], description: 'Категории' })
    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @ApiProperty({ example: ['Тег 1', 'Тег 2'], description: 'Теги' })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({ example: [{ name: 'Продукт 1', value: 'Его значение' }], description: 'Недостатки продукта' })
    @IsArray()
    @ValidateNested()
    @Type(() => ProductCharacteristicDto)
    characteristics: ProductCharacteristicDto[];
}
