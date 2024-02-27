import { ChatMember } from 'src/chat/entities/chat-member.entity';
import { ChatMessage } from 'src/chat/entities/chat-message.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './database.constants';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: process.env.DATABASE_TYPE as any,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Post, Chat, ChatMember, ChatMessage],

        migrationsTableName: 'migrations',

        migrations: ['src/database/migrations/*.ts'],

        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
