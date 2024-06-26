import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUrlPaymentDto {
  @IsNotEmpty()
  @IsString()
  readonly productName: string;

  @IsNotEmpty()
  @IsString()
  readonly price: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
}
