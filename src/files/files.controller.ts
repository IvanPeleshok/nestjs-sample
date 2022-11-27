import { Controller } from '@nestjs/common';
import { HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAUthGuard } from 'src/auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(private readonly filesServices: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtAUthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uplodaFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
		return this.filesServices.saveFiles([file]);
	}
}
