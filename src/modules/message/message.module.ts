import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ConfigModule,
    JwtModule,
    UsersModule,
    ConversationsModule,
  ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
