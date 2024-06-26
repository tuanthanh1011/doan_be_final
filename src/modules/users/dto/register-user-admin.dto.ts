import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserAdminDto {
  @IsEmail({}, { message: 'Email is not in the correct format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsNotEmpty({ message: 'Role cannot be empty' })
  role: string;
}
