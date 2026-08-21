import { IsOptional, IsString, IsDateString, IsNumber, IsLatitude, IsLongitude, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venueAddress?: string;

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
  landmark?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialRequests?: string;
}