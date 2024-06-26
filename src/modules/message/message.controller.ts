import { Controller, Get, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';
import { Roles } from 'src/decorator/role.decorator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('USER')
  @Get()
  findAllByUser(@User() user: IUser) {
    const { id } = user;
    return this.messageService.findAllByUser(id);
  }
}
