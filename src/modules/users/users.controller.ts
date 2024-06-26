import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from './users.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipe/validation.pipe';
import { RegisterUserAdminDto } from './dto/register-user-admin.dto';
import { UpdateUserAdminDto } from './dto/update-user.dto copy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(@Query() findAllUserDto: FindAllUserDto) {
    return this.usersService.findAll(findAllUserDto);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  post(@Body() registerUserAdminDto: RegisterUserAdminDto) {
    return this.usersService.post(registerUserAdminDto);
  }

  @Roles('EMPLOYEE')
  @UseGuards(JwtAuthGuard)
  @Get('totalAccount')
  getTotalAccountUser() {
    return this.usersService.getTotalAccountUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('findOne')
  findUserById(@User() user: IUser) {
    const { id } = user;
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get(':id')
  findUserAdminById(@Param('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const { id } = user;
    return this.usersService.update(updateUserDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch('')
  updateByAdmin(@Body() updateUserDto: UpdateUserAdminDto) {
    return this.usersService.updateByAdmin(updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new FileValidationPipe())
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    const urlImage = await this.usersService.uploadFile(file);
    res.json({
      data: {
        urlImage: urlImage,
      },
    });
  }
}
