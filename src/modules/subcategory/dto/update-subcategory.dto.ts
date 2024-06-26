import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSubcategoryDto {
  @IsString()
  @IsOptional()
  subCategoryName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
