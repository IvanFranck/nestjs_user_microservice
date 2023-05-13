import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { userStub } from '../stubs/user.stub';
import * as request from 'supertest';
import { DatabaseService } from '../../../database/database.service';
import { AppModule } from '../../../app.module';
import { User } from 'src/users/schemas/user.schema';

describe('UserController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    dbConnection = module.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  describe('CreateUser', () => {
    test('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: userStub().email,
        password: userStub().password,
      };

      const resp = await request(httpServer).post('/users').send(createUserDto);

      expect(resp.status).toBe(201);
      expect(resp.body).toEqual(
        expect.objectContaining({
          email: createUserDto.email,
        }),
      );

      const user = await dbConnection
        .collection('users')
        .findOne({ email: createUserDto.email });
      expect(user).toEqual(
        expect.objectContaining({
          email: createUserDto.email,
        }),
      );
    });

    test('should hash the password', async () => {
      const createUserDto: CreateUserDto = {
        email: userStub().email,
        password: userStub().password,
      };

      const resp = await request(httpServer).post('/users').send(createUserDto);

      expect(resp.status).toBe(201);
      expect(resp.body).toEqual(
        expect.objectContaining({
          email: createUserDto.email,
        }),
      );

      const user = await dbConnection
        .collection('users')
        .findOne({ email: createUserDto.email });
      expect(user.password).not.toEqual(createUserDto.password);
    });
  });
});
