import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './chat/chat.adapgter';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true }
  );

  const configService = app.get(ConfigService)


  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter();
  app.useWebSocketAdapter(redisIoAdapter);

  const serverPort = configService.get('SERVER_HTTP_PORT') || 3002;
  const socketPort = configService.get('SERVER_SOCKET_PORT') || 3003;
  const serverAddress = '0.0.0.0';

  const dbPort = configService.get('DATABASE_PORT');

  const serverUrl = `http://127.0.0.1:${serverPort}`;

  const docs = require("swagger.json");
  docs.servers = [{ url: serverUrl }];
  SwaggerModule.setup("swagger", app, docs);


  await app.listen(serverPort, serverAddress);

  logger.log(`Server HTTP is running on ${serverUrl}`)
  logger.log(`Server Socket is running on ${serverAddress}:${socketPort}`)
  logger.log({ dbPort })

}
bootstrap();
