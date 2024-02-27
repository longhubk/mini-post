import { BaseEnity } from 'src/common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IChatMember } from '../chat.interface';
import { Chat } from './chat.entity';

@Entity()
export class ChatMember extends BaseEnity implements IChatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  chatId: number;

  @ManyToOne((type) => User, (user) => user.chatMembers)
  @JoinColumn({ name: 'userId' })
  user: User | number;

  @ManyToOne((type) => Chat, (chat) => chat.chatMembers)
  @JoinColumn({ name: 'chatId' })
  chat: Chat | number;
}
