import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  GatewayMetadata,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SortOrder } from 'src/common/common.interface';
import { UniqueUser } from 'src/user/user.interface';
import { AppSocketClient } from './chat.interface';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatMessageDto } from './dto/get-chat-messages.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';

//TODO: find the way to pass env to here
@WebSocketGateway<GatewayMetadata>(3005, {
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(ChatGateway.name);
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.debug('initialized');
  }

  async handleConnection(client: AppSocketClient, ...args: any[]) {
    const auth_token = client.handshake.headers.authorization;

    if (!auth_token) {
      this.logger.debug('Token Not found');
      return client.disconnect();
    }
    const access_token = auth_token.split(' ')[0]; // TODO add bearer
    // this.logger.debug({ access_token });

    try {
      const payload: UniqueUser = await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.get<string>('ACCESS_JWT_SECRET'),
      });
      this.logger.debug({ socketUser: payload });
      client.user = payload;

      await client.join(`user_${payload.id}`);

      await this.getMyChatList(client);
    } catch (err) {
      this.logger.debug('Token wrong');
      return client.disconnect();
    }

    this.logger.debug(`client ${client.user.id} connected`);
  }

  async handleDisconnect(client: AppSocketClient) {
    this.logger.debug(`client disconnected`);
  }

  @SubscribeMessage('create-chat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: AppSocketClient,
  ) {
    this.logger.debug(`client ${client.user.id} create chat`);
    this.logger.debug({ createChatDto });

    try {
      const createdChat = await this.chatService.create(
        { id: client.user.id },
        createChatDto,
      );
      await client.join(`chat_${createdChat.id}`);

      client.emit('created-chat', { chat: createdChat.id });

      for (const toMember of createChatDto.toMembers) {
        this.server.to(`user_${toMember}`).emit('new-chat', { chat: createdChat.id });
      }
    } catch (err) {
      client.emit('error', { err: String(err) });
    }
  }

  @SubscribeMessage('get-my-chat-list')
  async getMyChatList(@ConnectedSocket() client: AppSocketClient) {
    const myChatMembers: ChatMember[] = await this.chatService.findAll(client.user.id);

    await client.join(myChatMembers.map((myChatMember) => `chat_${myChatMember.chatId}`));

    client.emit('my-chat-list', { myChatList: myChatMembers });
  }

  @SubscribeMessage('join-chat')
  async joinChat(
    @ConnectedSocket() client: AppSocketClient,
    @MessageBody() joinChatDto: JoinChatDto,
  ) {
    await client.join(`chat_${joinChatDto.chatId}`);
    const lastChatMessages = await this.getChatMessages(
      {
        page: 1,
        pageSize: 10,
        chatId: joinChatDto.chatId,
        orderBy: 'created_at',
        sortOrder: SortOrder.ASC,
      },
      client,
    );
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: AppSocketClient,
  ) {
    //TODO: make sure all user online join chat room before send;

    const createdChatMessage = await this.chatService.createMessage({
      ...sendMessageDto,
      userId: client.user.id,
    });
    this.server
      .to(`chat_${createdChatMessage.chatId}`)
      .emit('new-message', { newMessage: createdChatMessage });
  }

  @SubscribeMessage('get-chat-messages')
  async getChatMessages(
    @MessageBody() getChatMessageDto: GetChatMessageDto,
    @ConnectedSocket() client: AppSocketClient,
  ) {
    const chatMessages: [ChatMessage[], number] = await this.chatService.paginateMessage(
      getChatMessageDto,
      {
        chatId: getChatMessageDto.chatId,
      },
    );
    this.server
      .to(`user_${client.user.id}`)
      .emit('chat-messages', { chatMessages: chatMessages[0], total: chatMessages[1] });
  }
}
