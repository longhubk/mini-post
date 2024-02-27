import { ChatMember } from 'src/chat/entities/chat-member.entity';
import { BaseEnity } from 'src/common/common.interface';
import { Post } from 'src/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser, USERNAME_MAX_LEN } from '../user.interface';

@Entity()
export class User extends BaseEnity implements IUser {
  @Column({ length: USERNAME_MAX_LEN, unique: true })
  username: string;

  @Column({ length: 500 }) // dont use PASSWORD_MAX_LEN because password hash
  password: string;

  @OneToMany((type) => Post, (photo) => photo.user)
  posts: Post[];

  @OneToMany((type) => ChatMember, (chatMember) => chatMember.chat)
  chatMembers: ChatMember[];
}
