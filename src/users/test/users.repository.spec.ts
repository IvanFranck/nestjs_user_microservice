import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { User } from '../schemas/user.schema';
import { UserModel } from './support/user.model';
import { userStub } from './stubs/user.stub';
import { FilterQuery } from 'mongoose';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;

  describe('create operations', () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          UsersRepository,
          {
            provide: getModelToken(User.name),
            useValue: UserModel,
          },
        ],
      }).compile();

      usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    });
    describe('create', () => {
      describe('when create is called', () => {
        let user: User;
        let saveSpy: jest.SpyInstance;
        let constructorSpy: jest.SpyInstance;

        beforeEach(async () => {
          saveSpy = jest.spyOn(UserModel.prototype, 'save');
          constructorSpy = jest.spyOn(UserModel.prototype, 'constructorSpy');

          user = await usersRepository.create(userStub());
        });

        test('then it should call the userModel', () => {
          expect(saveSpy).toHaveBeenCalled();
          expect(constructorSpy).toHaveBeenCalledWith(userStub());
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });

  describe('find operations', () => {
    let userModel: UserModel;
    let userFilterQuery: FilterQuery<User>;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
          UsersRepository,
          {
            provide: getModelToken(User.name),
            useClass: UserModel,
          },
        ],
      }).compile();

      usersRepository = module.get<UsersRepository>(UsersRepository);
      userModel = module.get<UserModel>(getModelToken(User.name));

      userFilterQuery = {
        userId: userStub().userId,
      };

      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let user: User;

        beforeEach(async () => {
          jest.spyOn(userModel, 'findOne');
          user = await usersRepository.findOne(userFilterQuery);
        });

        test('then it should call userModel', () => {
          expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery, {
            _id: 0,
            __v: 0,
          });
        });

        test('then it should return a user', () => {
          expect(user).toEqual(userStub());
        });
      });
    });
  });
});
