import { IChatMember } from '../chat.interface';

export interface JoinChatDto extends Pick<IChatMember, 'chatId'> {}
