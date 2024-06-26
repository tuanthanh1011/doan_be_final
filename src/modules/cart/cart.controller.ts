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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    const { id } = user;
    return this.cartService.create(createCartDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findCartByUser(@User() user: IUser) {
    const { id } = user;
    return this.cartService.findCartByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('product/:id')
  deleteProductOfCart(@User() user: IUser, @Param('id') productId: string) {
    const { id } = user;
    return this.cartService.deleteProductOfCart(id, productId);
  }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') cartId: string,
    @Body() updateCartDto: UpdateCartDto,
    @User() user: IUser,
  ) {
    const { id } = user;
    return this.cartService.update(cartId, updateCartDto, id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
