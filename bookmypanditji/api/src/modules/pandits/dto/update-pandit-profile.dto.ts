import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PricingMode } from '@prisma/client';

export class UpdatePanditProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceCities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  serviceRadius?: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ enum: PricingMode })
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
}