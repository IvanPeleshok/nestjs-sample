import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import * as request from 'supertest';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
    login: 'test@test.com',
    password: 'test',
};



describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

	it('/login/login (POST) - success', async () => {
		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200);
		
		expect(response.body.access_token).toBeDefined();
	});

	it('/login/login (POST) - fail password', async () => {
		const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, password: "password" })
            .expect(401, {
                statusCode: 401,
                message: 'Нерправильный пароль',
                error: 'Unauthorized'
            });
	});

	it('/login/login (POST) - fail login', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ ...loginDto, login: "unknown" })
            .expect(401, {
                statusCode: 401,
                message: 'Пользователь с таким email не найден',
                error: 'Unauthorized'
            });
    });

    afterAll(() => {
        disconnect();
    });
});
