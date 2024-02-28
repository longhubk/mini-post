import { GenericFilter } from 'src/common/common.interface';
import { IChatMessage, ICreateChatMessage } from '../chat.interface';

export interface GetChatMessageDto
  extends GenericFilter<IChatMessage>,
    Pick<ICreateChatMessage, 'chatId'> {}
