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
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/delete-wishlist.dto';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @User() user: IUser) {
    const { id } = user;
    return this.wishlistService.create(createWishlistDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findWishlistByUser(@User() user: IUser) {
    const { id } = user;
    return this.wishlistService.findWishlistByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') productId: string, @User() user: IUser) {
    const { id } = user;
    return this.wishlistService.remove(productId, id);
  }
}
