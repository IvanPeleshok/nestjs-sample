import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { HttpStatus } from '@nestjs/common/enums';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	login: 'test@test.com',
	password: 'test'
}

const testDto: CreateReviewDto = {
    name: 'test',
    title: 'title',
    description: 'description',
    rating: 5,
    productId,
};

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
	let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

		const response = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);

		token = response.body.access_token;
    });

    it('/review/create (POST) - success', async () => {
        const response = await request(app.getHttpServer())
            .post('/review/create')
            .send(testDto)
            .set('Authorization', 'Bearer ' + token)
            .expect(201);
		createdId = (response as request.Response).body._id;
		expect(createdId).toBeDefined();
	});

	it('/review/create (POST) - fail', async () => {
        request(app.getHttpServer())
            .post('/review/create')
            .send({ testDto, rating: 0 })
            .set('Authorization', 'Bearer ' + token)
            .expect(400);
    });
	
	it('/review/byProduct/:productId (GET) - success', async () => {
        const response = await request(app.getHttpServer())
            .get('/review/byProduct/' + productId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        const { body } = response as request.Response;
        expect(body.length).toBe(1);
    });

	it('/review/byProduct/:productId (GET) - fail', async () => {
        const response = await request(app.getHttpServer())
            .get('/review/byProduct/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        const { body } = response as request.Response;
        expect(body.length).toBe(0);
    });

	it('/review/:id (DELETE) - success', async () => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
			.set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

	it('/review/:id (DELETE) - fail', async () => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: HttpStatus.NOT_FOUND,
                message: REVIEW_NOT_FOUND,
            });
    });

	afterAll(() => {
		disconnect();
	});
});
