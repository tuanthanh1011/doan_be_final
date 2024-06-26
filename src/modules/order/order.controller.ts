import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';
import { FindOrderDto } from './dto/list-order.dto';
import { Roles } from 'src/decorator/role.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: any, @User() user: IUser) {
    const { id } = user;

    const { listProduct } = createOrderDto;

    const totalPrice = listProduct.reduce((acc, curr) => {
      return acc + parseInt(curr.price) * curr.quantity;
    }, 0);

    return this.orderService.create({ ...createOrderDto, totalPrice }, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findOrderByUser(@User() user: IUser, @Query() query: FindOrderDto) {
    const { id } = user;
    return this.orderService.findOrderByUser(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Get()
  findAll(@Query() query: FindOrderDto) {
    console.log(query);
    return this.orderService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Get('totalOrder')
  getTotalOrder() {
    return this.orderService.getTotalOrder();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Get('totalSale')
  getTotalSale() {
    return this.orderService.getTotalSale();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') orderId: string, @User() user: IUser) {
    const { id } = user;
    return this.orderService.findOne(orderId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Get('admin/:id')
  findOneIgnoreUserId(@Param('id') orderId: string) {
    return this.orderService.findOneIgnoreUserId(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('cancelOrder/:id')
  handleCancelOrder(@Param('id') orderId: string, @User() user: IUser) {
    const { id } = user;
    return this.orderService.handleCancelOrder(orderId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('EMPLOYEE')
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const { status } = updateOrderDto;
    return this.orderService.update(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
