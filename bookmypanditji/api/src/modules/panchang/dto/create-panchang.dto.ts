import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePanchangDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  tithi: string;

  @ApiProperty()
  @IsString()
  paksha: string; // Shukla/Krishna

  @ApiProperty()
  @IsString()
  nakshatra: string;

  @ApiProperty()
  @IsString()
  yoga: string;

  @ApiProperty()
  @IsString()
  karana: string;

  @ApiProperty()
  @IsString()
  sunrise: string;

  @ApiProperty()
  @IsString()
  sunset: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moonrise?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moonset?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  festivals?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vrats?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  muhurat?: any;

  @ApiPropertyOptional()
  @IsOptional()
  choghadiya?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rahukalam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  yamagandam?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gulikai?: string;

  @ApiPropertyOptional()
  @IsOptional()
  regionalVariations?: any;
}