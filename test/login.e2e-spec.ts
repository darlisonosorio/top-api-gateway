import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/auth/login (POST) success', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it('/auth/login (POST) invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'invalid-user', password: 'admin123' })
      .expect(401);

    expect(response.body.statusCode).toBe(401);
    expect(response.body.token).not.toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});