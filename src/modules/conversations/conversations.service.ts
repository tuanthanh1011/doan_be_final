import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { MessageService } from '../message/message.service';
import { IUser } from '../users/users.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { sender, receiver, isActive } = createConversationDto;

    const conversationPartial: DeepPartial<Conversation> = {
      customerId: { id: sender },
      staffId: receiver ? { id: receiver } : null,
      isActive: isActive,
    };

    const conversation =
      this.conversationRepository.create(conversationPartial);

    return this.conversationRepository.save(conversation);
  }

  async findConversationByCustomerAndStaff(
    customerId: string,
    staffId?: string,
  ) {
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.customerId', 'customerId')
      .leftJoinAndSelect('conversation.staffId', 'staffId')
      .where('customerId.id = :customerId', { customerId: customerId })
      .andWhere('conversation.isActive = true');

    return query.getOne();
  }

  // Lấy ra cuộc trò chuyện của người dùng tại thời điểm đó - 1 thời điểm chỉ được 1 conversation được active
  async findConversationByCustomer(customerId: string) {
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.customerId', 'customerId')
      .leftJoinAndSelect('conversation.staffId', 'staffId')
      .where('customerId.id = :customerId', { customerId: customerId })
      .andWhere('conversation.isActive = true');

    return query.getOne();
  }

  async findAllConversationByAdminOrEmployee(userRole: string, userId: string) {
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.customerId', 'customerId')
      .leftJoinAndSelect('conversation.staffId', 'staffId');

    if (userRole == 'EMPLOYEE') {
      query
        .where('conversation.staffId IS NULL')
        .orWhere('conversation.staffId = :id', { id: userId });
    }

    query.orderBy(`conversation.lastActivity`, 'DESC');

    return query.getMany();
  }

  async setStaffToConversation(conversation: any, user: IUser) {
    const { id } = conversation;

    const findConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.staffId', 'staffId')
      .where('conversation.id = :id', { id })
      .andWhere('conversation.staffId IS NULL')
      .getOne();

    console.log(findConversation);
    if (!findConversation) {
      throw new BadRequestException('Phiên liên hệ đã được xử lý');
    }
    findConversation.staffId = user as User;

    await this.conversationRepository.save(findConversation);

    return findConversation;
  }

  async createConversation(
    senderId: string,
    receiverId: string | null,
    content: string,
  ): Promise<Conversation> {
    const conversationPartial: DeepPartial<Conversation> = {
      customerId: { id: senderId },
      staffId: receiverId ? { id: receiverId } : null,
    };

    const conversation =
      this.conversationRepository.create(conversationPartial);
    await this.conversationRepository.save(conversation);

    return conversation;
  }

  async isExistingConversation(conversationId: string) {
    const conversation = await this.conversationRepository.findOneBy({
      id: conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện hợp lệ');
    }

    return conversation;
  }

  async updateLastActivity(conversationId: string) {
    const conversation = await this.conversationRepository.findOneBy({
      id: conversationId,
    });
    if (!conversation) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện hợp lệ');
    }

    conversation.lastActivity = new Date();
    await this.conversationRepository.save(conversation);
    return conversation;
  }

  async gettAllConversationByUser(user: IUser) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.customerId = :userId', { userId: user.id })
      .orderBy('conversation.lastActivity', 'DESC')
      .getMany();

    return conversation;
  }

  async closeConversation(conversationId: string) {

    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.customerId', 'customerId')
      .leftJoinAndSelect('conversation.staffId', 'staffId')
      .where('conversation.id = :id', { id: conversationId })
      .getOne()

    if (!conversation) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện hợp lệ');
    }

    conversation.isActive = false;
    await this.conversationRepository.save(conversation);
    return conversation;
  }
}
