import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FinanceController } from '../src/finance/finance.controller';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';

describe('FinanceController (E2E)', () => {
  let app: INestApplication;
  let clientProxyMock: Partial<ClientProxy>;

  beforeAll(async () => {
    clientProxyMock = {
      send: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        {
          provide: 'FINANCE_SERVICE',
          useValue: clientProxyMock,
        },
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /finance should call findAll', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue([{ id: '1', value: 100 }]);

    const response = await request(app.getHttpServer())
      .get('/finance?page=1&limit=10&search=test')
      .expect(200);

    expect(response.body).toEqual([{ id: '1', value: 100 }]);
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'find-all-finances' },
      { page: 1, limit: 10, search: 'test' },
    );
  });

  it('GET /finance/:id should call findOne', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '1', value: 100 });

    const response = await request(app.getHttpServer())
      .get('/finance/1')
      .expect(200);

    expect(response.body).toEqual({ id: '1', value: 100 });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'find-finance' },
      { id: '1' },
    );
  });

  it('POST /finance should call create', async () => {
    const data = { value: 200, description: 'Test' };
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '2', ...data });

    const response = await request(app.getHttpServer())
      .post('/finance')
      .send(data)
      .expect(201);

    expect(response.body).toEqual({ id: '2', ...data });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'create-finance' },
      data,
    );
  });

  it('PUT /finance/:id should call update', async () => {
    const updateData = { value: 250, description: 'Updated' };
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '2', ...updateData });

    const response = await request(app.getHttpServer())
      .put('/finance/2')
      .send(updateData)
      .expect(200);

    expect(response.body).toEqual({ id: '2', ...updateData });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'update-finance' },
      { id: '2', ...updateData },
    );
  });

  it('DELETE /finance/:id should call remove', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ success: true });

    const response = await request(app.getHttpServer())
      .delete('/finance/2')
      .expect(200);

    expect(response.body).toEqual({ success: true });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'delete-finance' },
      { id: '2' },
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
