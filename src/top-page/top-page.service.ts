import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { TopLevelCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
    constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {}

    async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
        return this.topPageModel.create(dto);
    }

    async get(id: string) {
        return await this.topPageModel.findById(id).exec();
    }

    async findbyAlias(alias: string) {
        return this.topPageModel.findOne({ alias }).exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .aggregate([
                {
                    $match: { firstCategory },
                    $group: {
                        _id: { secondCategory: '$secondCategory' },
                        pages: { $push: { alias: '$alias', title: '$titlfirstCategorye' } },
                    },
                },
            ])
            .exec();
    }

    async deleteById(id: string) {
        return await this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async findByText(text: string) {
        return this.topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
    }
}
