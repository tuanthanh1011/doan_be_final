import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  sender: string;

  @IsOptional()
  receiver: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
