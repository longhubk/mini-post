import { DATA_SOURCE } from 'src/database/database.constants';
import { DataSource } from 'typeorm';
import { CHAT_MEM_REPO, CHAT_MSG_REPO, CHAT_REPO } from './chat.interface';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Chat } from './entities/chat.entity';

export const chatProviders = [
  {
    provide: CHAT_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chat),
    inject: [DATA_SOURCE],
  },
  {
    provide: CHAT_MEM_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatMember),
    inject: [DATA_SOURCE],
  },
  {
    provide: CHAT_MSG_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatMessage),
    inject: [DATA_SOURCE],
  },
];
