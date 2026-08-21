import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, Max, IsLatitude, IsLongitude, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PricingMode } from '@prisma/client';

export class CreatePanditProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string; // Shastri, Acharya, etc.

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({ type: [String], default: ['Hindi', 'English'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceCities: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  serviceRadius?: number; // km

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatitude()
  baseLatitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLongitude()
  baseLongitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  weeklySchedule?: Record<string, { start: string; end: string }[]>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockedDates?: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ enum: PricingMode, default: PricingMode.FIXED })
  @IsOptional()
  @IsEnum(PricingMode)
  pricingMode?: PricingMode;

  @ApiPropertyOptional()
  @IsOptional()
  customPricing?: Record<string, number>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoIntro?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}