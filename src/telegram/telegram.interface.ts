import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOption {
	chatId: string;
	token: string;
}

export interface ITelegramModuleAsyncOption extends Pick<ModuleMetadata, "imports"> {
	useFactory: (...args: any[]) => Promise<ITelegramOption> | ITelegramOption;
	inject?: any[];
}