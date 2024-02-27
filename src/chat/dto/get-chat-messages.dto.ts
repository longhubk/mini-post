import { GenericFilter } from 'src/common/common.interface';
import { ICreateChatMessage } from '../chat.interface';

export interface GetChatMessageDto
  extends GenericFilter,
    Pick<ICreateChatMessage, 'chatId'> {}
