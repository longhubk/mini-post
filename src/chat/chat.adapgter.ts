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
    const redisHost = this.configService.get<string>('CACHING_HOST');
    const redisPort = this.configService.get<string>('CACHING_PORT');
    const redisDB = this.configService.get<string>('CACHING_DB');
    const password = this.configService.get<string>('CACHING_PASSWORD');

    const redisUrl = `redis://${redisHost}:${redisPort}/${redisDB}`;

    this.logger.debug({ redisUrl });
    const pubClient = createClient({
      url: redisUrl,
      password,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const socketPort: number = parseInt(
      this.configService.get('SERVER_SOCKET_PORT') || '3006',
    );
    this.logger.debug({ socketPort, defaultPort: port });
    const server = super.createIOServer(socketPort, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
