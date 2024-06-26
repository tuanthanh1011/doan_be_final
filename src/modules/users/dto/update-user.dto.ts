import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  username: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Avatar không được để trống' })
  avatar: string;
}
