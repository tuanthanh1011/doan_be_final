import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
