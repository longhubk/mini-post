import { Socket } from 'socket.io';
import { IEntity } from 'src/common/common.interface';
import { UniqueUser } from 'src/user/user.interface';

export interface AppSocketClient extends Socket {
  user: UniqueUser;
}

export const CHAT_REPO = 'CHAT_REPOSITORY';

export interface IChat extends IEntity {
  name: string;

  direct_unique: string | null;
}

export interface ICreateChat extends Omit<IChat, keyof IEntity> {}

export const CHAT_MEM_REPO = 'CHAT_MEMBER_REPOSITORY';

export interface IChatMember extends IEntity {
  userId: number;

  chatId: number;
}

export interface ICreateChatMember extends Omit<IChatMember, keyof IEntity> {}

export const CHAT_MSG_REPO = 'CHAT_MESSAGE_REPOSITORY';

export interface IChatMessage extends IEntity {
  text_message: string;

  userId: number;

  chatId: number;
}

export interface ICreateChatMessage extends Omit<IChatMessage, keyof IEntity> {}
