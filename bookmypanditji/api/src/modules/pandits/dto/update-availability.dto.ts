import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  blockedDates?: string[];
}