import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/user/user.providers';
import { ChatGateway } from './chat.gateway';
import { chatProviders } from './chat.providers';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [...chatProviders, ...userProviders, ChatGateway, ChatService],
})
export class ChatModule {}
