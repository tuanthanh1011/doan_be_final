import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';
import { ROLES } from 'src/constans/role.constant';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.EMPLOYEE)
  @Patch()
  setStaffToConversation(
    @User() user: IUser,
    @Body() body: { conversation: any },
  ) {
    const { conversation } = body;
    return this.conversationsService.setStaffToConversation(conversation, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  gettAllConversationByUser(@User() user: IUser) {
    return this.conversationsService.gettAllConversationByUser(user);
  }
}
