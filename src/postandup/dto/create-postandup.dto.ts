import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostandupDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
