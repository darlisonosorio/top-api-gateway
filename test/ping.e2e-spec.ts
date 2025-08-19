import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PingController } from '../src/ping/ping.controller';
import { PingService } from '../src/ping/ping.service';

describe('PingController (E2E)', () => {
  let app: INestApplication;
  let pingService: PingService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [
        {
          provide: PingService,
          useValue: {
            pingUsers: jest.fn().mockResolvedValue({ status: 'ok', service: 'users' }),
            pingFinance: jest.fn().mockResolvedValue({ status: 'ok', service: 'finance' }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    pingService = moduleFixture.get<PingService>(PingService);
    await app.init();
  });

  it('/ping-users (GET) should return users ping result', async () => {
    const response = await request(app.getHttpServer())
      .get('/ping-users')
      .expect(200);

    expect(response.body).toEqual({ status: 'ok', service: 'users' });
    expect(pingService.pingUsers).toHaveBeenCalled();
  });

  it('/ping-finance (GET) should return finance ping result', async () => {
    const response = await request(app.getHttpServer())
      .get('/ping-finance')
      .expect(200);

    expect(response.body).toEqual({ status: 'ok', service: 'finance' });
    expect(pingService.pingFinance).toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
