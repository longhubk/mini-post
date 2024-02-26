import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { CommonResolver } from './common/common.resolver';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['.env'],
      // load: [configuration],
      // envFilePath: ['.mini-post.server.env', '.mini-post.database.env', '.mini-post.caching.env'],
      isGlobal: true,
    }),

    // TypeOrmModule.forRoot({
    // type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'poll_user',
    //   password: 'poll_password',
    //   database: 'poll_db',
    //   entities: [],
    //   synchronize: true,
    // }),

    // TypeOrmModule.forRoot({
    //   type: process.env.DATABASE_TYPE as any,
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    //     const databaseConfig: TypeOrmModuleOptions = {
    //       type: 'postgres',
    //       host: configService.get<string>('DATABASE_HOST'),
    //       port: +configService.get<string>('DATABASE_PORT'),
    //       password: configService.get<string>('DATABASE_PASSWORD'),
    //       username: configService.get<string>('DATABASE_USERNAME'),
    //       database: configService.get<string>('DATABASE_NAME'),

    //       entities: [
    //         // __dirname + '/../**/*.entity{.ts,.js}',
    //         User,
    //         Post,
    //         Chat
    //       ],

    //       synchronize: true,
    //     }
    //     console.log({ databaseConfig })
    //     return databaseConfig
    //   },
    // }),
    DatabaseModule,
    PostModule,
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonResolver],
})
export class AppModule { }
