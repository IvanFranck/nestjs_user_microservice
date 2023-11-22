import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from './schemas/user.schema';
import {
  CreateUserDto,
  UserAvatarUploadedEventPayload,
} from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { USER_AVATAR_UPLOADED_EVENT } from 'src/constants';
import { RmqService } from 'src/rmq/rmq.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.userService.findUser(id);
  }

  @EventPattern(USER_AVATAR_UPLOADED_EVENT)
  async handleUserAvatarUploaded(
    @Payload() data: UserAvatarUploadedEventPayload,
    @Ctx() context: RmqContext,
  ) {
    console.log('data: ', data);
    await this.userService.updateUserAvatar(data);
    this.rmqService.ack(context);
  }

  @EventPattern('user_authenticated')
  async handleUserAuthenticated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('data user_authenticated', data);
    this.rmqService.ack(context);
  }
}
