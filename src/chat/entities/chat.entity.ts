import { BaseEnity } from 'src/common/common.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IChat } from '../chat.interface';
import { ChatMember } from './chat-member.entity';

@Entity()
export class Chat extends BaseEnity implements IChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  direct_unique: string | null;

  @OneToMany((type) => ChatMember, (chatMember) => chatMember.chat)
  chatMembers: ChatMember[];
}
