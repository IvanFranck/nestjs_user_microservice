import { User } from 'src/users/schemas/user.schema';

export const userStub = (): User => {
  return {
    userId: '111',
    email: 'john@doe.com',
  };
};
