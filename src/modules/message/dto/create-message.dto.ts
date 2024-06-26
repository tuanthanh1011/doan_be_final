import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsOptional()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
