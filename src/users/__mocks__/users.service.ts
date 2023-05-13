import { userStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  createUser: jest.fn().mockResolvedValue(userStub()),
  findUser: jest.fn().mockResolvedValue(userStub()),
});
