import { IsOptional, IsString, IsEmail, IsEnum, IsDateString, IsPhoneNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, Gender, MaritalStatus } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  anniversaryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spouseName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('IN')
  spousePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  spouseDob?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  spouseTob?: string;

  @ApiPropertyOptional()
  @IsOptional()
  children?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebookToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canPostToFb?: boolean;
}