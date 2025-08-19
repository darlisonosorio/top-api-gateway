import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersController } from '../src/users/users.controller';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';

describe('UsersController (E2E)', () => {
  let app: INestApplication;
  let clientProxyMock: Partial<ClientProxy>;

  beforeAll(async () => {
    clientProxyMock = {
      send: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USERS_SERVICE',
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

  it('GET /users should call findAll', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue([{ id: '1', name: 'John Doe' }]);

    const response = await request(app.getHttpServer())
      .get('/users?page=1&limit=10&search=john')
      .expect(200);

    expect(response.body).toEqual([{ id: '1', name: 'John Doe' }]);
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'find-all-users' },
      { page: 1, limit: 10, search: 'john' },
    );
  });

  it('GET /users/:id should call findOne', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '1', name: 'John Doe' });

    const response = await request(app.getHttpServer())
      .get('/users/1')
      .expect(200);

    expect(response.body).toEqual({ id: '1', name: 'John Doe' });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'find-user' },
      { id: '1' },
    );
  });

  it('POST /users should call create', async () => {
    const userData = { name: 'Jane Doe' };
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '2', ...userData });

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    expect(response.body).toEqual({ id: '2', ...userData });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'create-user' },
      userData,
    );
  });

  it('PUT /users/:id should call update', async () => {
    const updateData = { name: 'Jane Smith' };
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ id: '2', ...updateData });

    const response = await request(app.getHttpServer())
      .put('/users/2')
      .send(updateData)
      .expect(200);

    expect(response.body).toEqual({ id: '2', ...updateData });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'update-user' },
      { id: '2', ...updateData },
    );
  });

  it('DELETE /users/:id should call remove', async () => {
    (clientProxyMock.send as jest.Mock).mockResolvedValue({ success: true });

    const response = await request(app.getHttpServer())
      .delete('/users/2')
      .expect(200);

    expect(response.body).toEqual({ success: true });
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      { cmd: 'delete-user' },
      { id: '2' },
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
