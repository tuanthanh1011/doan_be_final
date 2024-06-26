import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  product: string;
}
