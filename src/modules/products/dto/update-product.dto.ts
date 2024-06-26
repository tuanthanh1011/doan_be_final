import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName: string;

  @IsString()
  @IsOptional()
  subcategory: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  price: number;
}
