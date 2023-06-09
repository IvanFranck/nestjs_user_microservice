import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(userInfos: CreateUserDto) {
    return this.userRepository.create({
      userId: uuid4(),
      email: userInfos.email,
      password: userInfos.password,
    });
  }

  async findUser(userId: string) {
    return this.userRepository.findOne({
      userId,
    });
  }
}
