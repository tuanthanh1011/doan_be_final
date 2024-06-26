import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDetailProductDto {
  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  product: string;
}
