import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UserAvatarUploadedEventPayload,
} from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(userInfos: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userInfos.password, salt);
    return this.userRepository.create({
      userId: uuid4(),
      email: userInfos.email,
      password: hash,
    });
  }

  async findUser(userId: string) {
    return this.userRepository.findOne({
      userId,
    });
  }

  async updateUserAvatar(
    avatarUrl: UserAvatarUploadedEventPayload,
  ): Promise<void> {
    const result = await this.userRepository.findOneAndUpdate(
      {
        userId: '2966476d-904c-4ceb-94da-7524716a61fa',
      },
      {
        avatar: avatarUrl.filename,
      },
    );
    console.log('result: ', result);
  }
}
