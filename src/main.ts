import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

	const document = SwaggerModule.createDocument(
		app, 
		new DocumentBuilder()
			.setTitle('API')
			.setDescription('Sample')
			.setVersion('1.0.0')
			.addTag('Nest')
			.build()
	);
	
	SwaggerModule.setup('/api/docs', app, document);
		

    await app.listen(3000);
}

bootstrap();
