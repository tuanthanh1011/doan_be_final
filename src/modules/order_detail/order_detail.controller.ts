import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { CreateOrderDetail } from './order_detail.interface';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetail) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.update(+id, updateOrderDetailDto);
  }

  @Delete()
  remove(@User() user: IUser) {
    const { id } = user;
    return this.orderDetailService.remove(+id);
  }
}
