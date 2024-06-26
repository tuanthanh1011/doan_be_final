import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckReviewedDto {
  @IsNotEmpty()
  @IsString()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
