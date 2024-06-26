import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rate: number;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}
