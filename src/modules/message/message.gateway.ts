import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';
import { WSAuthMiddleware } from 'src/middleware/auth.middleware';
import { UsersService } from '../users/users.service';
import { AuthSocket } from 'src/constans/type';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationsService } from '../conversations/conversations.service';
import { Message } from './entities/message.entity';

interface DataSocket {
  socketId: string;
  userId: string;
}

@WebSocketGateway(80, {
  cors: {
    origin: ['http://192.168.43.219:8080', 'http://localhost:8080'],
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly conversationsService: ConversationsService,
  ) {}

  dataSocketId: DataSocket[] = [];

  @WebSocketServer()
  server: Server;

  afterInit() {
    const middle = WSAuthMiddleware(
      this.jwtService,
      this.usersService,
      this.configService,
    );
    this.server.use(middle);
  }

  addUserOrUpdate(socketId: string, userId: string): void {
    const existingIndex = this.dataSocketId.findIndex(
      (data) => data.userId === userId,
    );
    if (existingIndex !== -1) {
      this.dataSocketId[existingIndex] = { socketId, userId };
    } else {
      this.dataSocketId.push({ socketId, userId });
    }
  }

  async handleConnection(socket: AuthSocket) {
    console.log('connected: ', socket.id, socket.user.id, socket.user.username);
    this.addUserOrUpdate(socket.id, socket.user.id);

    await this.usersService.updateStatusUser(true, socket.user.id);
  }

  async handleDisconnect(socket: AuthSocket) {
    this.dataSocketId = this.dataSocketId.filter(
      (socketDetail) => socketDetail.userId !== socket.user.id,
    );

    await this.usersService.updateStatusUser(false, socket.user.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() createMessageDto: any,
    @ConnectedSocket() socket: AuthSocket,
  ) {
    const { senderId, receiverId, content, conversationId } = createMessageDto;

    let conversation =
      await this.conversationsService.findConversationByCustomerAndStaff(
        senderId,
        receiverId,
      );

    let message = {};

    if (!conversation) {
      conversation = await this.conversationsService.createConversation(
        senderId,
        receiverId,
        content,
      );

      message = await this.messageService.create({
        conversation: conversation,
        sender: senderId,
        content: content,
      });
    } else {
      await this.conversationsService.isExistingConversation(conversation.id);

      message = await this.messageService.create({
        conversation: conversation,
        sender: senderId,
        content: content,
      });
    }

    let { sender, ...dataProcessed } = message as Message;

    const user = await this.usersService.findOne(sender.toString());

    if (conversation.staffId) {
      socket.to(conversation.id).emit('receiveMessageAdminOrEmployee', {
        sender: user,
        ...dataProcessed,
      });
    }

    const dataSocket = this.dataSocketId.find(
      (data) => data.userId === senderId,
    );

    this.server
      .to(dataSocket.socketId)
      .emit('afterCreateConversation', conversation);

    // Trả về messsage cho account vừa gửi tin nhắn để hiển thị
    this.server
      .to(dataSocket.socketId)
      .emit('receiveMessage', { sender: user, ...dataProcessed });

    this.server.emit('fetchAllConversation');

    await this.conversationsService.updateLastActivity(conversation.id);
  }

  @SubscribeMessage('fetchAllConversation')
  async fetchAllConversation(@ConnectedSocket() socket: AuthSocket) {
    const userRole = socket.user.role;
    const userId = socket.user.id;
    return this.conversationsService.findAllConversationByAdminOrEmployee(
      userRole,
      userId,
    );
  }

  @SubscribeMessage('sendMessageAdminOrEmployee')
  async handleMessageAdmin(
    @MessageBody() createMessageDto: any,
    @ConnectedSocket() socket: AuthSocket,
  ) {
    const { senderId, receiverId, content, conversation } = createMessageDto;

    const message = await this.messageService.create({
      conversation: conversation,
      sender: senderId,
      receiver: receiverId,
      content: content,
    });

    let { sender, ...dataProcessed } = message;

    const userSender = await this.usersService.findOne(sender);
    const userReceiver = await this.usersService.findOne(receiverId);

    const dataSocket = this.dataSocketId.find(
      (data) => data.userId === receiverId,
    );

    socket
      .to(conversation.id)
      .emit('receiveMessage', { sender: userSender, ...dataProcessed });

    const dataSocketSender = this.dataSocketId.find(
      (data) => data.userId === senderId,
    );

    this.server
      .to(dataSocketSender.socketId)
      .emit('receiveMessageAdminOrEmployee', {
        sender: userSender,
        receiver: userReceiver,
        ...dataProcessed,
      });

    await this.conversationsService.updateLastActivity(conversation.id);
  }

  @SubscribeMessage('fetchData')
  async findAll(@ConnectedSocket() socket: AuthSocket) {
    const conversation =
      await this.conversationsService.findConversationByCustomer(
        socket.user.id,
      );

    const messages =
      await this.messageService.findAllByConversation(conversation);

    return messages;
  }

  @SubscribeMessage('fetchDataNotActive')
  async fetchDataNotActive(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() body: any,
  ) {
    const messages = await this.messageService.findAllByConversation({
      id: body.conversationId,
    });

    return messages;
  }

  @SubscribeMessage('closeConversation')
  async closeConversation(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() body: any,
  ) {
    const conversation = await this.conversationsService.closeConversation(
      body.conversationId,
    );

    const dataSocket = this.dataSocketId.find(
      (data) => data.userId === conversation.customerId.id,
    );

    this.server.to(dataSocket.socketId).emit('closeConversation');
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() conversation: any,
  ) {
    const { id } = conversation;
    socket.join(id);

    this.server.emit('fetchAllConversation');
  }

  @SubscribeMessage('updateAfterJoined')
  async handleAfterJoined(@ConnectedSocket() socket: AuthSocket) {
    this.server.emit('fetchAllConversation');
  }

  @SubscribeMessage('getConversation')
  async findConversation(@ConnectedSocket() socket: AuthSocket) {
    const conversation =
      await this.conversationsService.findConversationByCustomer(
        socket.user.id,
      );
    return conversation;
  }

  @SubscribeMessage('fetchDataByConversation')
  async findAllMessageByConversation(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() conversation: any,
  ) {
    const messages =
      await this.messageService.findAllByConversation(conversation);

    console.log(messages);
    return {
      messages,
    };
  }
}
