import { ICreateChat } from '../chat.interface';

export interface CreateChatDto extends ICreateChat {
  toMembers: number[];
}
