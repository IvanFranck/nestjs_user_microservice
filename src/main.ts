import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './rmq/rmq.service';
import { USER_QUEUE } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rmqService = app.get(RmqService);

  app.connectMicroservice(rmqService.getOptions(USER_QUEUE));
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
