import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
