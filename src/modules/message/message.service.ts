import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: any): Promise<any> {
    const message = this.messageRepository.create(createMessageDto);

    return await this.messageRepository.save(message);
  }

  async findAllByUser(userId: string) {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.senderId', 'sender')
      .leftJoinAndSelect('message.receiverId', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', {
        userId,
      })
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'message.updatedAt',
        'sender.id', // Trả về trực tiếp ID của sender
        'receiver.id', // Trả về trực tiếp ID của receiver
      ])
      .orderBy('message.createdAt', 'ASC');

    const listMessage = await query.getMany();
    return listMessage;
  }

  async findAllByConversation(conversation: any) {
    const { id } = conversation;
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender_id')
      .where('conversation_id = :id', { id })
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return messages;
  }
}
