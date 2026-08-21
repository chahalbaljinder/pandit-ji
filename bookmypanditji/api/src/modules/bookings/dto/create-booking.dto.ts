import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsDateString, ValidateNested, Min, Max, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VenueType } from '@prisma/client';

export class SamagriItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  panditId?: string;

  @ApiProperty()
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '12:00' })
  @IsString()
  endTime: string;

  @ApiPropertyOptional({ default: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ enum: VenueType, default: VenueType.HOME })
  @IsOptional()
  @IsEnum(VenueType)
  venueType?: VenueType;

  @ApiProperty()
  @IsString()
  venueAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatitude()
  venueLatitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLongitude()
  venueLongitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  participants?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ type: [SamagriItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SamagriItemDto)
  samagriItems?: SamagriItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  travelCharges?: number;
}