import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com or +919876543210' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  identifier: string; // email or phone

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  password: string;
}