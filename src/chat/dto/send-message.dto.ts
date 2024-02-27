import { ICreateChatMessage } from '../chat.interface';

export interface SendMessageDto
  extends Pick<ICreateChatMessage, 'chatId' | 'text_message'> {}
