import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { userStub } from './stubs/user.stub';

//mock user service
jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    //set up testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    //clear all mocks data
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    describe('When createUser is called', () => {
      let user: User;
      let createUserDto: CreateUserDto;

      beforeEach(async () => {
        createUserDto = {
          email: userStub().email,
          password: userStub().password,
        };

        user = await usersController.createUser(createUserDto);
      });

      test('then it should call userService', () => {
        expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
      });

      test('then it should retun a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('find user', () => {
    describe('when findUser is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await usersController.findUser(userStub().email);
      });

      test('then il should call userService', () => {
        expect(usersService.findUser).toHaveBeenCalledWith(userStub().email);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
