
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(app: INestApplication, private readonly configService: ConfigService) {
    // Or simply get the ConfigService in here, since you have the `app` instance anyway
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisUrl = `redis://${this.configService.get('CACHING_HOST')}:${this.configService.get('CACHING_PORT')}/${this.configService.get('CACHING_DB')}`;
    const password = this.configService.get('CACHING_PASSWORD');

    this.logger.debug({ redisUrl, password });
    this.logger.debug({ hello: 12345 });
    const pubClient = createClient({
      url: redisUrl,
      // url: 'redis://mini-post-caching-service:6379/5',
      // username: 'default',
      // password: this.configService.get('CACHING_PASSWORD'),
      password,
      // password: 'm2pakRP2LSrR4q6ym4gcXStzUwFFbjvA5upEgW2gePKUDCgQIU',

    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const socketPort = this.configService.get('SOCKET_PORT');
    this.logger.debug({ socketPort });
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}