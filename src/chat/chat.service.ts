import { Inject, Injectable, Logger } from '@nestjs/common';
import { GenericFilter, SortOrder } from 'src/common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { USER_REPO, UniqueUser } from 'src/user/user.interface';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  CHAT_MEM_REPO,
  CHAT_MSG_REPO,
  CHAT_REPO,
  IChatMessage,
  ICreateChat,
  ICreateChatMessage,
} from './chat.interface';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    @Inject(CHAT_REPO)
    private readonly chatRepo: Repository<Chat>,

    @Inject(CHAT_MEM_REPO)
    private readonly chatMemRepo: Repository<ChatMember>,

    @Inject(USER_REPO)
    private readonly userRepo: Repository<User>,

    @Inject(CHAT_MSG_REPO)
    private readonly chatMsgRepo: Repository<ChatMessage>,
  ) {}

  public async create(
    uniqueUser: Partial<UniqueUser>,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    if (createChatDto.toMembers.length < 1) {
      throw new Error('TO_MEMBERS_CANNOT_BE_EMPTY');
    }

    if (!uniqueUser.id) {
      throw new Error('NOT_FOUND_CREATOR');
    }

    if (createChatDto.toMembers.includes(uniqueUser.id || 0)) {
      throw new Error('TO_MEMBERS_CANNOT_BE_YOURSELF');
    }
    const createChatBody: ICreateChat = { name: createChatDto.name, direct_unique: null };

    if (createChatDto.toMembers.length === 1) {
      createChatBody.direct_unique = [uniqueUser.id, ...createChatDto.toMembers]
        .sort()
        .join();
      const existedChat = await this.chatRepo.count({
        where: { direct_unique: createChatBody.direct_unique },
      });
      if (existedChat) {
        throw new Error('DIRECT_CHAT_EXISTED');
      }
    }

    for (const toMember of createChatDto.toMembers) {
      this.logger.debug({ toMember });
      const existedToMember = await this.userRepo.count({ where: { id: toMember } });
      if (!existedToMember) {
        throw new Error('TO_MEMBER_IS_NOT_USER');
      }
    }
    const chat = this.chatRepo.create(createChatBody);
    const newChat = await this.chatRepo.save(chat);
    this.logger.debug({ newChat });

    createChatDto.toMembers.push(uniqueUser.id);

    const members = this.chatMemRepo.create(
      createChatDto.toMembers.map((toMember) => ({
        chatId: newChat.id,
        userId: toMember,
      })),
    );

    const newChatMembers = await this.chatMemRepo.save(members);
    this.logger.debug({ newChatMembers });
    //TODO: implement transaction here

    return newChat;
  }

  public async findAll(userId: number): Promise<ChatMember[]> {
    this.logger.debug({ userId });
    return this.chatMemRepo.find({ where: { userId }, relations: ['chat'] });
  }

  public async createMessage(createMessageDto: ICreateChatMessage): Promise<ChatMessage> {
    const chatMem = await this.chatMemRepo.count({
      where: { chatId: createMessageDto.chatId },
    });
    if (!chatMem) {
      throw new Error('USER_HAS_NOT_JOINED_CHAT_YET');
    }
    const chatMsg = this.chatMsgRepo.create(createMessageDto);
    return this.chatMsgRepo.save(chatMsg);
  }

  protected createOrderQuery(filter: GenericFilter<IChatMessage>) {
    const order: { [k in keyof Partial<IChatMessage>]: SortOrder } = {};

    order.created_at = SortOrder.DESC;

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder || SortOrder.DESC;
      return order;
    }
    this.logger.debug({ order });
    return order;
  }

  public paginateMessage(
    filter: GenericFilter<IChatMessage>,
    where: FindOptionsWhere<ChatMessage>,
  ): Promise<[ChatMessage[], number]> {
    return this.chatMsgRepo.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: where,
      relations: ['user'], //TODO: remove password field, password in hash format
    });
  }
}
