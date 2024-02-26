// import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';
import { Chat } from 'src/chat/entities/chat.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './database.constants';

// dotenv.config();

// function patchAsyncDataSourceSetup() {
//   const oldIsDataSource = InstanceChecker.isDataSource;
//   InstanceChecker.isDataSource = function (obj: unknown): obj is DataSource {
//     if (obj instanceof Promise) {
//       return true;
//     }
//     return oldIsDataSource(obj);
//   }
// }
// patchAsyncDataSourceSetup();


export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      // console.log('wait');
      // await ConfigModule.envVariablesLoaded;
      // console.log('loaded');

      const dataSource = new DataSource({
        type: process.env.DATABASE_TYPE as any,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [
          // __dirname + '/../**/*.entity{.ts,.js}',
          User,
          Post,
          Chat
        ],
        synchronize: true,
      });
      console.log({ dataSource })

      return dataSource.initialize();
    },
  },
];