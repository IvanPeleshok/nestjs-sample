import { ConfigService } from '@nestjs/config';
import { ITelegramOption } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (configService: ConfigService): ITelegramOption => {
	const token = configService.get('TELEGRAM_TOKEN');
	if (!token) {
		throw new Error('TELEGRAM_TOKEN missing');
	}
	
    return {
        token,
        chatId: configService.get("CHAT_ID") ?? '',
    };
};
