import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostandupDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
