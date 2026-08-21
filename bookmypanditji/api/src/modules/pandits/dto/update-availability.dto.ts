import { IsOptional, ValidateNested, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty()
  start: string; // HH:mm

  @ApiProperty()
  end: string; // HH:mm
}

export class UpdateAvailabilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  weeklySchedule?: Record<string, TimeSlotDto[]>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockedDates?: string[];
}