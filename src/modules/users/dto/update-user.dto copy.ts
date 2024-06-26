import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  username: string;

  @IsOptional()
  @IsNotEmpty({ message: 'mã người dùng không được để trống' })
  userId: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Quyền tài khoản không được để trống' })
  role: string;
}
