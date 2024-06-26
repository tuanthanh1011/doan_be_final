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
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';
import { IUser } from '../users/users.interface';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createUserAddressDto: CreateUserAddressDto,
    @User() user: IUser,
  ) {
    const { id } = user;
    return this.userAddressService.create(createUserAddressDto, id);
  }

  @Get()
  findAll() {
    return this.userAddressService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findUserAddressByUser(@User() user: IUser) {
    const { id } = user;
    return this.userAddressService.findUserAddressByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') idAddress: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(idAddress, updateUserAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') userAddressId: string, @User() user: IUser) {
    const { id } = user;
    return this.userAddressService.remove(userAddressId, id);
  }
}
